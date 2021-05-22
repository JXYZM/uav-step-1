/*
Amap.js
主界面
*/
import React, { Component } from 'react'
import { Map, MouseTool, Marker, Polyline } from 'react-amap'
import { connect } from 'dva'
import {
  Button,
  Card,
  Row,
  Col,
  Tabs,
  Tooltip,
  List,
  Layout,
  Form,
  Collapse,
  Descriptions,
  Badge,
  Space,
  Input,
  Select,
  InputNumber,
  Switch,
  Slider,
  Radio,
  Checkbox,
  Rate,
  Upload,
  message,
  Table
} from 'antd'
import {
  MinusCircleOutlined,
  PlusOutlined,
  createFromIconfontCN,
  UploadOutlined,
  InboxOutlined
} from '@ant-design/icons'
import load_point from '../resources/load_point'
import load_map from '../resources/load_map'

const IconFont0 = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1282563_kns8e1am00d.js'
})

const IconFont1 = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1289406_de15s4r5mdv.js'
})

const { TabPane } = Tabs
const { Header, Content, Footer } = Layout
const { Panel } = Collapse
const { Option } = Select
const { Column, ColumnGroup } = Table

const namespace = 'planning'

const mapStateToProps = ({ [namespace]: n }) => {
  return {
    tInfo: n.todo_list,
    pInfo: n.position,
    fmInfo: n.flight_mission,
    ftInfo: n.flight_todolist,
    moInfo: n.model
    // fInfo: n.flight_info,
    // mInfo: n.mission_info,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    post_algo_profile: values => {
      const action = {
        type: `${namespace}/post_algo_profile`,
        payload: {
          type: 0,
          ...values
        }
      }
      dispatch(action)
    },
    plan: () => {
      const action = {
        type: `${namespace}/plan`,
        payload: {
          type: 1
        }
      }
      dispatch(action)
    }
  }
}

const formItemLayout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 14, offset: 0 }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Amap extends Component {
  constructor() {
    super()
    const self = this
    this.timer
    this.state = {
      what: '点击下方按钮开始绘制',
      load_point,
      color: [
        'aqua',
        'blue',
        'black',
        'blueviolet',
        'brown',
        'burlywood',
        'chartreuse',
        'cadetblue',
        'coral',
        'crimson',
        'darkolivegreen',
        'grey',
        'darkred',
        'darkseagreen',
        'dodgerblue',
        'navy'
      ],
      button_disabled: true,
      selectedRowKeys: [],
      need: [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17'
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
    }
    this.toolEvents = {
      created: tool => {
        self.tool = tool
      },
      draw({ obj }) {
        self.drawWhat(obj)
      }
    }
    this.mapPlugins = ['ToolBar']
    this.mapCenter = load_map
  }

  display() {
    let temp = []
    for (let a of this.props.pInfo.keys()) {
      temp = temp.concat({
        key: 'uav' + JSON.stringify(a),
        position: {
          longitude: this.props.pInfo[a][0] / 1000000,
          latitude: this.props.pInfo[a][1] / 1000000
        },
        id: JSON.stringify(a)
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
    console.log(temp_path)
    return [temp, temp_path]
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({ selectedRowKeys, need: selectedRowKeys })
  }

  render() {
    var load_uav = []
    var path = []
    if (this.props.moInfo === 1) {
      ;[load_uav, path] = this.display()
    }

    const onSave = values => {
      console.log('Received values of form: ', values)
      this.props.post_algo_profile(values)
      this.setState({
        button_disabled: false
      })
    }

    const uploadChange = info => {
      // console.log('Upload event:', e)
      // if (Array.isArray(e)) {
      //   return e
      // }
      // return e && e.fileList
      const { status } = info.file

      console.log(info)

      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} uploaded successfully.`, 3)
        // analyze
        const { response } = info.file
        if (response.status == 'success') {
          message.success(`${info.file.name} analyzed successfully.`, 3)
        } else {
          message.error(`${info.file.name} analyzed failed.`, 3)
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} upload failed.`, 3)
      }
    }
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }

    return (
      <div className="container">
        <div className="header">
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
              <IconFont0 style={{ padding: '20px' }} type="icon-wurenji-copy" />
              {`无人集群智能规划平台`}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="my_map">
            <Map
              events={this.amapEvents}
              plugins={this.mapPlugins}
              center={this.mapCenter}
            >
              <MouseTool events={this.toolEvents} />
              {this.state.load_point.map(item => (
                <Marker
                  position={item.position}
                  extData={{ key: item.key }}
                  clickable
                  title={item.key.toString()}
                  events={this.markerEvents}
                />
              ))}
              {/* {this.props.moInfo === 1 && */}
              {load_uav.map(
                item =>
                  this.state.need.indexOf(item.id) > -1 && (
                    <Marker
                      position={item.position}
                      // icon={'//vdata.amap.com/icons/b18/1/2.png'}
                      offset={{ x: -8, y: -12 }}
                      title={item.key}
                    >
                      <IconFont1 type="icon-wurenji" />
                    </Marker>
                  )
              )}
              {/* {this.props.moInfo === 1 && */}
              {path.map(
                item =>
                  this.state.need.indexOf(JSON.stringify(item.key)) > -1 && (
                    <Polyline
                      path={item.route}
                      showDir={true}
                      style={{
                        strokeWeight: 4,
                        strokeColor: this.state.color[item.key]
                      }}
                    />
                  )
              )}
            </Map>
          </div>
          <div className="my_input">
            <Form
              name="input_form"
              {...formItemLayout}
              onFinish={onSave}
              autoComplete="off"
            >
              <span className="ant-form-text">算法配置页</span>
              <Form.Item
                name="select"
                label="选择"
                hasFeedback
                rules={[{ required: true, message: '缺少优化目标' }]}
              >
                <Select placeholder="选择优化目标">
                  <Option value="最小化总等待时间">最小化总等待时间</Option>
                  <Option value="无人机100%时间持续覆盖">
                    无人机100%时间持续覆盖
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="switch"
                label="智能规划算法"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item name="slider" label="无人机数目">
                <Slider
                  min={1}
                  max={16}
                  marks={{
                    1: '1',
                    4: '4',
                    7: '7',
                    10: '10',
                    13: '13',
                    16: '16'
                  }}
                />
              </Form.Item>
              <Form.Item label="上传">
                <Form.Item
                  name="dragger"
                  valuePropName="fileList"
                  getValueFromEvent={uploadChange}
                  noStyle
                >
                  <Upload.Dragger
                    name={'file'}
                    multiple={true}
                    action={'http://localhost:7000/dev/'}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">双击或拖拽文件以上传</p>
                    <p className="ant-upload-hint">支持任务描述文件</p>
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Button type="ghost" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="my_display">
            <div className="my_start">
              <Button
                type="primary"
                htmlType="button"
                size="large"
                disabled={this.state.button_disabled}
                block
              >
                <a
                  onClick={() => {
                    this.props.plan()
                  }}
                >
                  Plan
                </a>
              </Button>
            </div>
            <div className="my_interact">
              <div style={{ position: 'relative', left: '10%', width: '80%' }}>
                {this.props.moInfo === 1 && (
                  <Tabs defaultActiveKey="0" style={{ textAlign: 'center' }}>
                    <TabPane tab="无人集群个体动作信息" key="0">
                      <Table
                        dataSource={this.props.ftInfo}
                        rowSelection={rowSelection}
                      >
                        <Column title="编号" dataIndex="id" fixed="left" />
                        <Column title="动作序列" dataIndex="list" />
                      </Table>
                    </TabPane>
                    <TabPane tab="无人集群个体任务信息" key="1">
                      <Table dataSource={this.props.fmInfo}>
                        <Column title="编号" dataIndex="id" />
                        <Column title="执行任务" dataIndex="mission" />
                        <Column title="代价" dataIndex="cost" />
                      </Table>
                    </TabPane>
                  </Tabs>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
