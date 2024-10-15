import { InternalDocumentID } from "../components/internal-document-id-store.js"

export type Magnitude = number
export type VectorType = Float32Array
export type VectorTypeLike = number[] | VectorType

export type SimilarVector = [number, number]

export const DEFAULT_SIMILARITY = 0.8

export class VectorIndex {
    private vectors: Map<InternalDocumentID, [Magnitude, VectorType]> = new Map()
    private keys: InternalDocumentID[] = [];

    constructor(
        public size: number,
    ) {}

    add(internalDocumentId: InternalDocumentID, value: VectorTypeLike) {
        if (!(value instanceof Float32Array)) {
            value = new Float32Array(value)
        }

        const magnitude = getMagnitude(value, this.size)
        this.vectors.set(internalDocumentId, [magnitude, value])
        this.keys.push(internalDocumentId)
    }

    remove(internalDocumentId: InternalDocumentID) {
        this.vectors.delete(internalDocumentId)
        this.keys = this.keys.filter((key) => key !== internalDocumentId)
    }

    find(vector: VectorTypeLike, similarity: number = DEFAULT_SIMILARITY) {
        if (!(vector instanceof Float32Array)) {
            vector = new Float32Array(vector)
        }

        const results = findSimilarVectors(vector, this.keys, this.vectors, this.size, similarity)
        // .map(
        //     ([id, score]) => [getInternalDocumentId(orama.internalDocumentIDStore, id), score]
        // ) as [number, number][]

        return results
    }

    public toJSON(): { size: number, vectors: [InternalDocumentID, [Magnitude, number[]]][] } {
        const vectors: [InternalDocumentID, [Magnitude, number[]]][] = []

        for (const [id, [magnitude, vector]] of this.vectors) {
            vectors.push([id, [magnitude, Array.from(vector)]])
        }

        return {
            size: this.size,
            vectors,
        }
    }

    public static fromJSON(json: any): VectorIndex {
        const raw: { size: number, vectors: [InternalDocumentID, [Magnitude, number[]]][] } = json
        
        const index = new VectorIndex(raw.size)
        for (const [id, [magnitude, vector]] of raw.vectors) {
            index.vectors.set(id, [magnitude, new Float32Array(vector)])
            index.keys.push(id)
        }

        return index
    }
}


export function getMagnitude(vector: Float32Array, vectorLength: number): number {
    let magnitude = 0
    for (let i = 0; i < vectorLength; i++) {
      magnitude += vector[i] * vector[i]
    }
    return Math.sqrt(magnitude)
}

// @todo: Write plugins for Node and Browsers to use parallel computation for this function
export function findSimilarVectors(
    targetVector: Float32Array,
    keys: Array<InternalDocumentID>,
    vectors: Map<InternalDocumentID, [Magnitude, VectorType]>,
    length: number,
    threshold
): SimilarVector[] {
    const targetMagnitude = getMagnitude(targetVector, length)

    const similarVectors: SimilarVector[] = []

    for (const [vectorId, [magnitude, vector]] of vectors) {
        let dotProduct = 0

        for (let i = 0; i < length; i++) {
            dotProduct += targetVector[i] * vector[i]
        }

        const similarity = dotProduct / (targetMagnitude * magnitude)

        if (similarity >= threshold) {
            similarVectors.push([vectorId, similarity])
        }
    }

    return similarVectors.sort((a, b) => b[1] - a[1])
}
