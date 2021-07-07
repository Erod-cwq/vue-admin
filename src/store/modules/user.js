// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import {ACCESS_TOKEN, USER} from "@/store/mutation-type"
import adminApi from "@/api/admin";

const user = {
    state:{
        token: null,
        users:{}
    },
    mutations:{
        SET_TOKEN: (state, token) => {
            Vue.ls.set(ACCESS_TOKEN, token, 60*60*1000)
            state.token = token
        }
    },
    actions:{
        login({ commit }, { username, password, authcode}) {
            return new Promise((resolve, reject) => {
                adminApi
                    .login(username, password, authcode)
                    .then(response => {
                        const token = response.data
                        commit('SET_TOKEN', token)


                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        }
    }
}

export default user
