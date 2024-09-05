import { defineStore } from "pinia"

/**
 * 树结构缓存
 */
const treeStore = defineStore({
    id: "treeStore",
    state: () => {
        return {
            treeXz: [],
            treeJg: [],
            treeQy: [],
            searchTypeStore: undefined,
            searchNameStore: undefined
        }
    },
    getters: {
        getX () {
            return this.treeXz
        },
        getJ () {
            return this.treeJg
        },
        getQ () {
            return this.treeQy
        }
    },
    actions: {

    }
})

export { treeStore };
