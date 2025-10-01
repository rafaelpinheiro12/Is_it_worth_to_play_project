import {atom} from 'jotai'

const selectedGameAtom = atom(null)
const igdbDataAtom = atom(null)
const aiDataAtom = atom(null)
const isLoggedInAtom = atom(false)
const userAtom = atom(null)
const tokenAtom = atom(null)

export {selectedGameAtom, igdbDataAtom, aiDataAtom, isLoggedInAtom, userAtom, tokenAtom}