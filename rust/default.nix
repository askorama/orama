{ pkgs, nixpkgs, system, makeRustPlatform, rust-overlay }:
let
  rustPkgs = import nixpkgs {
    inherit system;
    overlays = [ (import rust-overlay) ];
  };

  rustVersion = "1.65.0";

  # Wasm target for Rust's wasm-bindgen
  wasmTarget = "wasm32-unknown-unknown";

  rustWithWasmTarget = rustPkgs.rust-bin.stable.${rustVersion}.default.override {
    targets = [ wasmTarget ];
  };

  rustPlatformWasm = makeRustPlatform {
    cargo = rustWithWasmTarget;
    rustc = rustWithWasmTarget;
    rustfmt = rustWithWasmTarget;
    wasm-bindgen-cli = rustWithWasmTarget;
  };

  common = {
    version = "0.3.1";
    src = ./.;

    cargoLock = {
      lockFile = ./Cargo.lock;
    };

    profile = "release";
    nativeBuildInputs = [ pkgs.pkg-config ];
    PKG_CONFIG_PATH = "${pkgs.openssl.dev}/lib/pkgconfig";
  };

  inherit (pkgs) jq coreutils wasm-bindgen-cli;
  inherit (builtins) nodejs readFile releaseTmp replaceStrings;

  wasm-crates = [
    "lyra-utils-wasm"
  ];
  forAllWasmCrates = f: builtins.listToAttrs (map (name: { inherit name; value = f name; }) wasm-crates);
in
rec {
  packages = forAllWasmCrates (crate:
    let pname = crate; in rustPlatformWasm.buildRustPackage (common // {
      pname = pname;
      nativeBuildInputs = with pkgs; [ wasm-bindgen-cli ];
      buildPhase = ''
        ./scripts/wasm.sh ${pname} ${common.profile};
      '';
      installPhase = ''
        echo "Signal that nix succeeded";
        mkdir -p $out;
      '';
      cargoCheckCommand = "cargo test";
      cargoArtifacts = null; # do not cache dependencies
    })
  );

  # lyra-utils-wasm = let pname = "lyra-utils-wasm"; in rustPlatformWasm.buildRustPackage (common // {
  #   pname = pname;
  #   nativeBuildInputs = with pkgs; [ git wasm-bindgen-cli ];
  #   buildPhase = ''
  #     ./scripts/wasm.sh ${pname} ${common.profile};
  #   '';
  # });

    # Takes a package version as its single argument, and produces
    # prisma-fmt-wasm with the right package.json in a temporary directory,
    # then prints the directory's path. This is used by the publish pipeline in CI.
    renderWasmPackage =
      pkgs.writeShellApplication {
        name = "renderWasmPackage";
        text = ''
          set -euxo pipefail

          PACKAGE_DIR=$(mktemp -d)
          cp -r --no-target-directory $out "$PACKAGE_DIR"
          echo "$PACKAGE_DIR"
        '';
      };
}
