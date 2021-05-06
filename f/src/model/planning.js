/*
planning.js
model 数据交互
*/
import { message } from 'antd'

import { myPost } from '../services/method'

export default {
  namespace: 'planning',
  state: {
    // mission_a: [],
    // mission_b: [],
    todo_list: [],
    position: [],
    flight_mission: [],
    flight_todolist: [],
    // flight_info: [
    //   {
    //     header: '0号无人机状态',
    //     key: '0',
    //     id: 'uav 0',
    //     position: '',
    //     status: ['', 'default'],
    //     battery: '',
    //     ma: '',
    //     mb: '',
    //     list: '',
    //     load: '',
    //     cost: '',
    //   },
    // ],
    // mission_info: [
    //   {
    //     header: '0号任务状态',
    //     key: '0',
    //     id: 'm 0',
    //     des: '',
    //     status: ['', 'default'],
    //   },
    // ],
  },
  effects: {
    *post_algo_profile({ payload }, sagaEffects) {
      const { call, put } = sagaEffects
      const response = yield call(myPost, payload)
      message.success(response['message'], 3)
    },
    *plan({ payload }, sagaEffects) {
      const { call, put } = sagaEffects
      const response = yield call(myPost, payload)
      yield put({ type: 'Change', payload: response })
      console.log(response)
    },
  },
  reducers: {
    Change(state, { payload: datasets }) {
      // const next_mission_a = datasets["mission_a"];
      // const next_mission_b = datasets["mission_b"];
      const next_todo_list = datasets['todo_list']
      const next_position = datasets['position']
      const next_flight_mission = datasets['flight_mission']
      const next_flight_todolist = datasets['flight_todolist']
      //const next_flight_info = datasets['flight_info']
      //const next_mission_info = datasets['mission_info']
      // const next_current_cost = datasets["current_cost"];
      // const next_mission = state.mission;
      // const next_algo = state.algo;
      // const next_trans = state.trans;
      return {
        // mission_a: next_mission_a,
        // mission_b: next_mission_b,
        todo_list: next_todo_list,
        position: next_position,
        flight_mission: next_flight_mission,
        flight_todolist: next_flight_todolist,
        //flight_info: next_flight_info,
        //mission_info: next_mission_info,
        // current_cost: next_current_cost,
        // mission: next_mission,
        // algo: next_algo,
        // trans: next_trans,
      }
    },
  },
}
