import { Map, MouseTool, Marker, Polyline } from 'react-amap'
import React, { Component } from 'react'
import { connect } from 'dva'
import { withRouter } from 'dva/router'
import {
  Button,
  Card,
  Row,
  Col,
  Tabs,
  Icon,
  Tooltip,
  List,
  Layout,
  Form
} from 'antd'
import { InputNumber, Input, Collapse } from 'antd'
import { Descriptions, Badge } from 'antd'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1282563_kns8e1am00d.js'
})
const IconFont_ = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1289406_de15s4r5mdv.js'
})
const { TabPane } = Tabs
const { Header, Content, Footer } = Layout
const { Panel } = Collapse

const namespace = 'planning'

const mapStateToProps = state => {
  const tInfo = state[namespace].todo_list
  const pInfo = state[namespace].position
  const fInfo = state[namespace].flight_info
  const mInfo = state[namespace].mission_info
  return {
    tInfo,
    pInfo,
    fInfo,
    mInfo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    query_from_host: () => {
      const action = {
        type: `${namespace}/query_from_host`,
        payload: {
          type: 0
        }
      }
      dispatch(action)
    }
    // mission: newMission => {
    //   const action = {
    //     type: `${namespace}/set_mission`,
    //     payload: newMission
    //   }
    //   dispatch(action)
    // },
    // algoChange: e => {
    //   //console.log("asdf")
    //   const action = {
    //     type: `${namespace}/set_algo`,
    //     payload: e.target.value
    //   }
    //   //console.log(action.payload)
    //   dispatch(action)
    // },
    // plan: newState => {
    //   const action = {
    //     type: `${namespace}/pre_to_plan`,
    //     payload: {
    //       type: 1,
    //       ...newState
    //     }
    //   }
    //   dispatch(action)
    // },
    // missionChange: e => {
    //   //console.log("asdf")
    //   const action = {
    //     type: `${namespace}/trans_mission`,
    //     payload: e.target.value
    //   }
    //   //console.log(action.payload)
    //   dispatch(action)
    // },
    // manage: newTrans => {
    //   const action = {
    //     type: `${namespace}/pre_to_manage`,
    //     payload: {
    //       type: 2,
    //       ...newTrans
    //     }
    //   }
    //   dispatch(action)
    // }
  }
}

// const layerStyle = {
//   padding: '10px',
//   background: '#fff',
//   border: '1px solid #ddd',
//   borderRadius: '4px',
//   position: 'absolute',
//   top: '10px',
//   left: '10px'
// };

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class Amap extends Component {
  constructor() {
    super()
    const self = this
    this.timer
    this.state = {
      what: '点击下方按钮开始绘制',
      load_point: [
        { key: 0, position: { longitude: 118.955476, latitude: 32.112982 } },
        { key: 1, position: { longitude: 118.956335, latitude: 32.113378 } },
        { key: 2, position: { longitude: 118.956324, latitude: 32.114623 } },
        { key: 3, position: { longitude: 118.956007, latitude: 32.115277 } },
        { key: 4, position: { longitude: 118.956619, latitude: 32.116245 } },
        { key: 5, position: { longitude: 118.957311, latitude: 32.115868 } },
        { key: 6, position: { longitude: 118.957375, latitude: 32.114959 } },
        { key: 7, position: { longitude: 118.9573, latitude: 32.113173 } },
        { key: 8, position: { longitude: 118.958191, latitude: 32.11415 } },
        { key: 9, position: { longitude: 118.958019, latitude: 32.114995 } },
        { key: 10, position: { longitude: 118.958266, latitude: 32.115849 } },
        { key: 11, position: { longitude: 118.958877, latitude: 32.114745 } },
        { key: 12, position: { longitude: 118.959199, latitude: 32.113373 } },
        { key: 13, position: { longitude: 118.959881, latitude: 32.113478 } },
        { key: 14, position: { longitude: 118.960224, latitude: 32.114677 } },
        { key: 15, position: { longitude: 118.959425, latitude: 32.115622 } },
        { key: 16, position: { longitude: 118.95943, latitude: 32.116195 } },
        { key: 17, position: { longitude: 118.960396, latitude: 32.116167 } },
        { key: 18, position: { longitude: 118.960385, latitude: 32.115718 } },
        { key: 19, position: { longitude: 118.960664, latitude: 32.114795 } },
        { key: 20, position: { longitude: 118.960921, latitude: 32.113673 } },
        { key: 21, position: { longitude: 118.962187, latitude: 32.113423 } },
        { key: 22, position: { longitude: 118.961651, latitude: 32.114318 } },
        { key: 23, position: { longitude: 118.961329, latitude: 32.11485 } },
        { key: 24, position: { longitude: 118.961141, latitude: 32.115168 } },
        { key: 25, position: { longitude: 118.962091, latitude: 32.115281 } },
        { key: 26, position: { longitude: 118.962021, latitude: 32.11589 } },
        { key: 27, position: { longitude: 118.961517, latitude: 32.115868 } },
        { key: 28, position: { longitude: 118.961597, latitude: 32.116485 } },
        { key: 29, position: { longitude: 118.960771, latitude: 32.115913 } }
      ],
      //testMarker:null,
      //load_mark: { key: 1, position: { longitude: 120, latitude: 32 } },
      //mission_id: 0,
      // position: {longitude: 120, latitude: 35 },
      // choose_start: false,
      // choose_pass: false,
      color: [
        'black',
        'brown',
        'green',
        'red',
        'blue',
        'yellow',
        'purple',
        'orange'
      ]
    }
    this.amapEvents = {
      created: mapInstance => {
        self.map = mapInstance
      }
    }
    this.lineEvents = {
      created: ins => {
        console.log(ins)
      },
      show: () => {
        console.log('line show')
      }
      // hide: () => {console.log('line hide')},
      // click: () => {console.log('line clicked')},
    }
    this.toolEvents = {
      created: tool => {
        self.tool = tool
      },
      draw({ obj }) {
        self.drawWhat(obj)
      }
    }
    this.markerEvents = {
      created: instance => {
        // console.log('Marker 实例创建成功；如果你需要对原生实例进行操作，可以从这里开始；');
        // console.log(instance);
        //instance.setExtData({key: 0})
      }
      // click: (e) => {
      //   // console.log("你点击了这个图标；调用参数为：");
      //   //console.log(e.target.B.extData.key);
      //   //e.target.setContent((e.target.B.extData.key).toString())
      //   if (this.state.choose_start === true) {
      //     e.target.setOffset({ x: -10, y: -15 })
      //     e.target.setIcon('//vdata.amap.com/icons/b18/1/2.png')
      //     e.target.setTitle((e.target.B.extData.key).toString())
      //   }
      //   else if (this.state.choose_pass === true) {
      //     e.target.setOffset({ x: -25, y: -60 })
      //     e.target.setIcon('//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png')
      //     e.target.setTitle((e.target.B.extData.key).toString())
      //   }
      //   //console.log(e.target.getOffset())
      //   if (this.state.choose_start === true) {
      //     // let temp = this.state.start.concat(e.target.B.extData.key)
      //     // this.setState({
      //     //   start: temp
      //     // })
      //     this.props.getStart(e.target.B.extData.key)
      //   }
      //   else if (this.state.choose_pass === true) {
      //     // let temp = this.state.pass.concat(e.target.B.extData.key)
      //     // this.setState({
      //     //   pass: temp
      //     // })
      //     this.props.getPass(e.target.B.extData.key)
      //   }
      //   console.log(this.state.choose_start)
      //   console.log(this.state.choose_pass)
      // },
      // dblclick: (e) => {
      //   console.log("你刚刚双击了这个图标；调用参数为：");
      //   console.log(e);
      // },
      // ... 支持绑定所有原生的高德 Marker 事件
    }
    this.mapPlugins = ['ToolBar']
    this.mapCenter = { longitude: 118.957746, latitude: 32.115395 }
  }

  // drawWhat(obj) {
  //   let text = ''
  //   switch (obj.CLASS_NAME) {
  //     case 'AMap.Marker':
  //       text = `你绘制了一个标记，坐标位置是 {${obj.getPosition()}}`
  //       break
  //     case 'AMap.Polygon':
  //       text = `你绘制了一个多边形，有${obj.getPath().length}个端点`
  //       break
  //     case 'AMap.Circle':
  //       text = `你绘制了一个圆形，圆心位置为{${obj.getCenter()}}`
  //       break
  //     default:
  //       text = ''
  //   }
  //   this.setState({
  //     what: text
  //   })
  // }

  // setMission() {
  //   //console.log(this.state.mission_id)
  //   this.props.mission(this.state.load_mission[this.state.mission_id])
  //   let next_mission_id = this.state.mission_id + 1
  //   this.setState({
  //     mission_id: next_mission_id
  //   })
  // }

  // setStart() {
  //   this.setState({
  //     choose_start: true,
  //     choose_pass: false,
  //   })
  // }

  // setPass() {
  //   this.setState({
  //     choose_start: false,
  //     choose_pass: true,
  //   })
  // }

  display() {
    let temp = []
    for (let a of this.props.pInfo.keys()) {
      temp = temp.concat({
        key: 'uav' + JSON.stringify(a),
        position: {
          longitude: this.props.pInfo[a][0] / 1000000,
          latitude: this.props.pInfo[a][1] / 1000000
        }
      })
    }
    let temp_path = []
    let count_out = 0
    for (let a of this.props.tInfo) {
      let temptemp = []
      temptemp = temptemp.concat({
        longitude: this.props.pInfo[count_out][0] / 1000000,
        latitude: this.props.pInfo[count_out][1] / 1000000
      })
      for (let b of a) {
        temptemp = temptemp.concat({
          longitude: this.state.load_point[b['point']].position.longitude,
          latitude: this.state.load_point[b['point']].position.latitude
        })
      }
      temp_path = temp_path.concat({ route: temptemp, key: count_out })
      count_out += 1
    }
    //console.log(temp);
    // this.setState({
    //   //load_uav: {...temp}
    //   load_uav: temp,
    //   path: temp_path,
    // },_=>{console.log(this.state.load_uav);})
    return [temp, temp_path]
  }

  render() {
    // const { aInfo, bInfo, tInfo, pInfo, cInfo, mInfo, algoInfo, transInfo, } = this.props
    // const newState = { algoInfo, mInfo }
    // const newTrans = { transInfo }
    const { tInfo, pInfo, fInfo, mInfo } = this.props
    //console.log(this.state.load_uav)
    //debugger
    const [load_uav, path] = this.display()
    //console.log(load_uva)
    return (
      <div>
        <Layout className="layout">
          <Header>
            <div
              className="logo"
              style={{
                position: 'absolute',
                left: 50,
                textAlign: 'left',
                color: 'white',
                fontSize: 24
              }}
            >
              <div>
                <IconFont
                  style={{ padding: '20px' }}
                  type="icon-wurenji-copy"
                />
                {`智能规划演示平台`}
              </div>
            </div>
          </Header>
          <Content style={{ padding: 50 }}>
            <div style={{ background: '#fff', padding: 20, minHeight: 500 }}>
              <div>
                <Row type="flex" justify="space-around" align="middle">
                  <div
                    style={{
                      position: 'relative',
                      left: '0',
                      width: '90%',
                      height: '500px',
                      padding: '20px 0 20px 20px'
                    }}
                  >
                    <Map
                      events={this.amapEvents}
                      plugins={this.mapPlugins}
                      center={this.mapCenter}
                      style={{ right: '0%', width: '80%' }}
                    >
                      <MouseTool events={this.toolEvents} />
                      {this.state.load_point.map(item => (
                        <Marker
                          position={item.position}
                          extData={{ key: item.key }}
                          clickable
                          title={item.key.toString()}
                          events={this.markerEvents}
                          //topWhenClick={true}
                          // visible={this.state.visible}
                        />
                      ))}
                      {/* <Marker
                        position={this.state.position}
                        //extData={{ key: item.key }}
                        // clickable
                        // title={(this.state.load_mark.key).toString()}
                        // events={this.markerEvents}
                      /> */}
                      {/* {this.state.testMarker} */}
                      {load_uav.map(item => (
                        <Marker
                          position={item.position}
                          icon={'//vdata.amap.com/icons/b18/1/2.png'}
                          offset={{ x: -10, y: -15 }}
                          //extData={{ key: item.key }}
                          //clickable
                          title={item.key}
                          //events={this.markerEvents}
                        />
                      ))}
                      {/* <IconFont_ type='icon-wurenji' /> */}
                      {/* </Marker>)} */}
                      {/* <Marker position={{ longitude: 121, latitude: 35 }} >
                        <IconFont_ type='icon-wurenji' />

                      </Marker> */}
                      {path.map(item => (
                        <Polyline
                          path={item.route}
                          //events={this.lineEvents}
                          showDir={true}
                          //strokeWeight={1500}
                          style={{
                            strokeWeight: 7,
                            strokeColor: this.state.color[item.key]
                          }}
                          //visible={this.state.visible}
                        />
                      ))}
                      {/* <div style={{ left: '10%', width: '80%' }}></div> */}
                    </Map>
                  </div>
                  <div
                    style={{ position: 'relative', left: '0', width: '47px' }}
                  >
                    <List size="small" bordered>
                      <List.Item>
                        <Tooltip placement="right" title="开始执行">
                          <a
                            onClick={_ => {
                              clearInterval(this.timer)
                              this.timer = setInterval(() => {
                                this.props.query_from_host()
                              }, 100)
                            }}
                          >
                            <IconFont
                              style={{ size: '40' }}
                              type="icon-start"
                            />
                          </a>
                          {/* <Button block onClick={() => { this.drawMarker() }}><IconFont type="icon-qidian1" /></Button> */}
                        </Tooltip>
                      </List.Item>
                    </List>
                  </div>
                  <Collapse>
                    <Panel header="无人集群个体信息管理" key="0">
                      <Collapse>
                        {this.props.fInfo.map(v => (
                          <Panel header={v['header']} key={v['key']}>
                            <Descriptions bordered>
                              <Descriptions.Item label="编号">
                                {v['id']}
                              </Descriptions.Item>
                              <Descriptions.Item label="位置">
                                {v['position']}
                              </Descriptions.Item>
                              <Descriptions.Item label="状态" span={3}>
                                <Badge status="processing" text={v['status']} />
                              </Descriptions.Item>
                              <Descriptions.Item label="电量">
                                {v['battery']}
                              </Descriptions.Item>
                              <Descriptions.Item label="待结束任务" span={2}>
                                {v['ma']}
                              </Descriptions.Item>
                              <Descriptions.Item label="待开始任务" span={2}>
                                {v['mb']}
                              </Descriptions.Item>
                              <Descriptions.Item label="动作序列" span={2}>
                                {v['list']}
                              </Descriptions.Item>
                              <Descriptions.Item label="当前任务数">
                                {v['load']}
                              </Descriptions.Item>
                              <Descriptions.Item label="预计完成代价">
                                {v['cost']}
                              </Descriptions.Item>
                            </Descriptions>
                          </Panel>
                        ))}
                      </Collapse>
                    </Panel>
                    <Panel header="任务信息管理" key="1">
                      <Collapse>
                        {this.props.mInfo.map(v => (
                          <Panel header={v['header']} key={v['key']}>
                            <Descriptions bordered>
                              <Descriptions.Item label="编号">
                                {v['id']}
                              </Descriptions.Item>
                              <Descriptions.Item label="任务描述">
                                {v['des']}
                              </Descriptions.Item>
                              <Descriptions.Item label="任务状态">
                                {v['status']}
                              </Descriptions.Item>
                            </Descriptions>
                          </Panel>
                        ))}
                      </Collapse>
                    </Panel>
                  </Collapse>
                </Row>
              </div>
            </div>
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
        </Layout>
      </div>
    )
  }
}

// const WrappedAmapForm = Form.create()(Amap);

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedAmapForm));
