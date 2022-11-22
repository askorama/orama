/* tslint:disable */
/* eslint-disable */
/**
* @param {IntersectScoresInput} arrays
* @returns {InsersectScoresOutput}
*/
export function intersectTokenScores(arrays: IntersectScoresInput): InsersectScoresOutput;
export interface IntersectScoresInput {
    data: [string, number][][];
}

export interface InsersectScoresOutput {
    data: [string, number][];
}

