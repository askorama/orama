########
# docker buildx build --load -f Dockerfile --build-context rust=rust --build-context node-src=src . -t lyrasearch/lyra-wasm --progress plain
# docker create --name tmp lyrasearch/lyra-wasm
# docker cp dummy:/opt/app/src/wasm ./src/wasm
# docker rm -f tmp
########

ARG RUST_VERSION="1.65.0"
ARG ALPINE_VERSION="3.17.0"

#######################
#### Wasm tools builder
#######################
FROM alpine:${ALPINE_VERSION} as wasm-tools
WORKDIR /tmp

RUN apk update \
  && apk add --no-cache bash curl git
RUN git clone https://github.com/WebAssembly/binaryen.git wasm-tools

WORKDIR /tmp/wasm-tools

RUN apk add build-base cmake git python3 py3-pip clang ninja \
  && pip3 install -r requirements-dev.txt

RUN git submodule init \
  && git submodule update \
  && cmake . -G Ninja -DCMAKE_INSTALL_PREFIX=out/install -DCMAKE_CXX_FLAGS="-static" -DCMAKE_C_FLAGS="-static" -DCMAKE_BUILD_TYPE=Release -DBUILD_STATIC_LIB=ON -DCMAKE_INSTALL_PREFIX=install \
  && ninja install

RUN cp ./bin/wasm-opt /usr/bin/wasm-opt

########################
#### Rust + Wasm builder
########################
FROM rust:${RUST_VERSION}-slim as builder

ARG WASM_BINDGEN_VERSION="0.2.83"

# Rust compilation profile
ARG LYRA_WASM_PROFILE="release"

# Rust+Wasm compilation target (e.g. nodejs, deno, etc.)
ARG LYRA_WASM_TARGET="nodejs"

# When set to "1", attempt Wasm optimization via wasm-opt
ARG LYRA_WASM_OPT="1"

##
# Install Rust and Node.js tools
##
WORKDIR /opt/app/rust

# Install Node.js (used for running wasm-bindgen scripts only)
RUN apt-get update -y \
  && apt-get install -y curl libssl-dev pkg-config \
  && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs

# Add Wasm target support
RUN rustup target add wasm32-unknown-unknown
RUN cargo install -f wasm-bindgen-cli@${WASM_BINDGEN_VERSION}

# Import the Rust project
COPY --from=rust . ./

# Run unit tests (and cache dependencies)
RUN cargo test

##
# Build the Wasm artifacts running wasm-bindgen via Node.js scripts
##
WORKDIR /opt/app/rust/scripts

ENV LYRA_WASM_PROFILE ${LYRA_WASM_PROFILE}
ENV LYRA_WASM_TARGET ${LYRA_WASM_TARGET}
ENV LYRA_WASM_OPT ${LYRA_WASM_OPT}

# Pull in the wasm-opt optimizer compiled in a previous stage
COPY --from=wasm-tools /usr/bin/wasm-opt /usr/bin/wasm-opt

# Install Node.js dependencies
RUN npm i
WORKDIR /opt/app
RUN (cd rust && node ./scripts/wasmAll.mjs)

################
#### Wasm output
################
FROM alpine:${ALPINE_VERSION} as output

WORKDIR /opt/app/src/wasm

COPY --from=builder /opt/app/src/wasm ./
