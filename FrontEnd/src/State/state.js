import {atom} from 'jotai'

const selectedGameAtom = atom(null)
const igdbDataAtom = atom(null)
const aiDataAtom = atom(null)
const isLoggedInAtom = atom(false)
const userAtom = atom(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null)
const tokenAtom = atom(localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null)

export {selectedGameAtom, igdbDataAtom, aiDataAtom, isLoggedInAtom, userAtom, tokenAtom}