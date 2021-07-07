import FileUpload from "@/components/FileUpload";
import Vue from "vue";
const _components = {
    FileUpload
}

const components = {}

Object.keys(_components).forEach(key => {
    components[key] = Vue.component(key, _components[key])
})

export default components
