<template>
  <div class="containers" ref="content">
    <div class="canvas" ref="canvas"></div>
    <!-- <div id="js-properties-panel" class="panel"></div> -->
    <div class="panel">
      1111111111111111111
    </div>
  </div>
</template>

<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
// import BpmnModeler from 'bpmn-js/lib/Modeler'
// import propertiesPanelModule from 'bpmn-js-properties-panel'
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
/* 左边工具栏以及编辑节点的样式 */
// import 'bpmn-js/dist/assets/diagram-js.css'
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// /* 右边工具栏样式 */
// import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'

// /* eslint-disable */q
export default {
  data () {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null
    }
  },
  methods: {
    createNewDiagram () {
      const bpmnXmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n' +
        '  <bpmn2:process id="Process_1" isExecutable="false">\n' +
        '  </bpmn2:process>\n' +
        '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
        '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
        '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
        '        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n' +
        '      </bpmndi:BPMNShape>\n' +
        '    </bpmndi:BPMNPlane>\n' +
        '  </bpmndi:BPMNDiagram>\n' +
        '</bpmn2:definitions>'
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(bpmnXmlStr, function (err) {
        if (err) {
          console.error(err)
        } else {
          // that.success()
        }
      })
    }
  }
  // mounted () {
  //   // 获取到属性ref为“content”的dom节点
  //   this.container = this.$refs.content
  //   // 获取到属性ref为“canvas”的dom节点
  //   this.canvas = this.$refs.canvas

  //   // 建模，官方文档这里讲的很详细
  //   this.bpmnModeler = new BpmnModeler({
  //     container: this.canvas,
  //     // // 添加控制板
  //     // propertiesPanel: {
  //     //   parent: '#js-properties-panel'
  //     // },
  //     additionalModules: [
  //       // 左边工具栏以及节点
  //       propertiesProviderModule
  //       // 右边的工具栏
  //       // propertiesPanelModule
  //     ]
  //     // moddleExtensions: {
  //     //   camunda: camundaModdleDescriptor
  //     // }
  //   })
  //   var eventBus = this.bpmnModeler.get('eventBus')
  //   // you may hook into any of the following events
  //   var events = [
  //     // 'element.hover',
  //     // 'element.out',
  //     'element.click'
  //     // 'element.dblclick',
  //     // 'element.mousedown',
  //     // 'element.mouseup'
  //   ]
  //   events.forEach(function (event) {
  //     eventBus.on(event, function (e) {
  //       // e.element = the model element
  //       // e.gfx = the graphical element
  //       console.log(event, 'on', e.element)
  //     })
  //   })
  //   this.bpmnModeler.on('commandStack.changed', function () {
  //     console.log('change')
  //     // user modeled something or
  //     // performed an undo/redo operation
  //   })

  //   this.bpmnModeler.on('element.changed', function (event) {
  //     var element = event.element
  //     console.log('element', element)
  //     // the element was changed by the user
  //   })
  //   this.createNewDiagram(this.bpmnModeler)
  // }
}
</script>

<style lang="scss" scoped>
  .containers{
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
  }
  .canvas{
    width: 100%;
    height: 100%;
  }
  .panel{
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
  }
</style>
