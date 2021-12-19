const fs = require('fs')

// tag::star1[]
/**
 * @param {string} pair 
 * @param {number} depth 
 * @param {Map<string, Map<string, number>>} lookupMap 
 * @param {Map<string, string>} rules 
 * @returns {Map<string, number>}
 */
function resolvePair(pair, depth, lookupMap, rules) {
    const pairHash = pair + depth
    const lookupPair = lookupMap.get(pairHash)
    if (lookupPair !== undefined) {
        return new Map(Array.from(lookupPair))
    }
    const insertChar = rules.get(pair)
    const leftPair = resolvePair(pair[0] + insertChar, depth - 1, lookupMap, rules)
    const rightPair = resolvePair(insertChar + pair[1], depth - 1, lookupMap, rules)
        // Remove overlapping character between "left" and right" pair from count
    rightPair.set(insertChar, rightPair.get(insertChar) - 1)
    const resultCountMap = mergeCountMap(leftPair, rightPair)
    lookupMap.set(pairHash, resultCountMap)
    return new Map(Array.from(resultCountMap))
}

/**
 * @param {Map<string, number>} leftMap 
 * @param {Map<string, number>} rightMap 
 */
function mergeCountMap(leftMap, rightMap) {
    const result = new Map([...rightMap])
    for (const [char, charCount] of leftMap.entries()) {
        result.set(char, charCount + (result.get(char) || 0))
    }
    return result
}

/**
 * @param {string} template 
 * @returns {Map<string, number>}
 */
function countChars(template) {
    const resultMap = new Map()
    for (const char of template) {
        resultMap.set(char, (resultMap.get(char) || 0) + 1)
    }
    return resultMap
}

/**
 * @param {Map<string, string>} rules
 * @returns {Map<string, Map<string, number>>}
 */
function seedLookupMap(rules) {
    /** @type {Map<string, Map<string, number>>} */
    const lookupMap = new Map()
    for (const [rule, char] of rules.entries()) {
        lookupMap.set(rule + 1, countChars(rule[0] + char + rule[1]))
    }
    return lookupMap
}

/**
 * @param {string} template 
 * @param {number} depth 
 * @param {Map<string, string>} rules 
 * @returns {Map<string, number>}
 */
function getCharCountForTemplate(template, depth, rules) {
    const lookupMap = seedLookupMap(rules)
        /** @type {Map<string, number>} */
    let result = new Map()
    for (let i = 0; i < template.length - 1; i++) {
        if (i > 0) {
            // Remove count for overlapping character
            result.set(template[i], result.get(template[i]) - 1)
        }
        result = mergeCountMap(result, resolvePair(template[i] + template[i + 1], depth, lookupMap, rules))
    }
    return result
}

/**
 * @param {string} template 
 * @param {Map<string, string>} rules 
 */
function runSolutionPuzzleOne(template, rules) {
    const result = getCharCountForTemplate(template, 10, rules)
    const leastCommonCnt = Math.min(...result.values())
    const mostCommonCnt = Math.max(...result.values())
    console.log(`Solution to first puzzle: ${mostCommonCnt - leastCommonCnt}`)
}
// end::star1[]

// tag::star2[]
/**
 * @param {string} template 
 * @param {Map<string, string>} rules 
 */
function runSolutionPuzzleTwo(template, rules) {
    const result = getCharCountForTemplate(template, 40, rules)
    const leastCommonCnt = Math.min(...result.values())
    const mostCommonCnt = Math.max(...result.values())
    console.log(`Solution to second puzzle: ${mostCommonCnt - leastCommonCnt}`)
}
// end::star2[]

// tag::input[]
const [template, rulesRaw] = fs.readFileSync('input.txt')
    .toString()
    .split('\n\n')
const rulesMap = new Map(rulesRaw
        .split('\n')
        .map(line => line.split(' -> ')))
    // end::input[]

runSolutionPuzzleOne(template, rulesMap)
runSolutionPuzzleTwo(template, rulesMap)