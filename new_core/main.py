#!/usr/bin/env python
# _*_ coding:utf-8 _*_
'''
main.py
manage module
'''

from copy import deepcopy
from flight import Flight
from core import handle
from output import generate_flight_mission, generate_flight_todolist, small2big
import math

import json
# from multiprocessing import Process
from flask import Flask
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources=r'/*')

NUM_OF_POINT = 30
NUM_OF_FLIGHT = 5
SPEED_OF_FLIGHT = 15
INTEL = True

MODEL = 0

POINT = {}
DIST = []
FLIGHT = {}

MISSIONS = []

MISSION_A = []
MISSION_B = []
TODO_LIST = []
POSITION = []
CURRENT_COST = []

def initialize_point():
    global POINT
    f = open("data/point.txt")
    lines = f.read().splitlines()
    for line in lines:
        temp = line.split(" ")
        POINT[int(temp[0])] = [float(temp[1]), float(temp[2])]
    f.close()

def initialize_dist():
    global DIST
    DIST = [[float(0) for i in range(NUM_OF_POINT)] for j in range(NUM_OF_POINT)]
    f = open("data/route.txt")
    lines = f.read().splitlines()
    for line in lines:
        temp = line.split(" ")
        DIST[int(temp[0])][int(temp[1])] = float(temp[2])
        DIST[int(temp[1])][int(temp[0])] = float(temp[2])
    f.close()

def load_file():
    initialize_point()
    initialize_dist()

def init_center():
    global MISSION_A
    global MISSION_B
    global TODO_LIST
    global POSITION
    global CURRENT_COST
    global FLIGHT
    MISSION_A = []
    MISSION_B = []
    TODO_LIST = []
    POSITION = []
    CURRENT_COST = []
    FLIGHT = {}
    for i in range(NUM_OF_FLIGHT):
        FLIGHT[i] = Flight(deepcopy([118958877.0, 32114745.0]))
        POSITION.append([118958877.0, 32114745.0])
        CURRENT_COST.append(0.0)
        MISSION_A.append([])
        MISSION_B.append([])
        TODO_LIST.append([])

def generate_distance(position):
    cost = {}
    len_of_content = NUM_OF_POINT + 1
    for i in range(NUM_OF_FLIGHT):
        content = [[float(0) for j in range(len_of_content)] for k in range(len_of_content)]
        for j in range(1, len_of_content):
            c = math.sqrt(pow(position[i][0] - POINT[j-1][0], 2) + pow(position[i][1] - POINT[j-1][1], 2)) / SPEED_OF_FLIGHT
            content[0][j] = c
            content[j][0] = c
        for j in range(1, len_of_content):
            for k in range(j+1, len_of_content):
                c = DIST[j-1][k-1] / SPEED_OF_FLIGHT
                content[j][k] = c
                content[k][j] = c
        cost[i] = content
    return deepcopy(cost)

def generate_cost_current(content, flight_id):
    if len(TODO_LIST[flight_id]) == 0:
        return 0.0
    else:
        time_all = 0
        cost_all = 0
        for i in range(len(TODO_LIST[flight_id])):
            point_id = TODO_LIST[flight_id][i]["point"]
            if i == 0:
                time_all += content[0][point_id + 1]
            else:
                time_all += content[TODO_LIST[flight_id][i - 1]["point"] + 1][point_id + 1]
            if "put" in TODO_LIST[flight_id][i]["todo"].keys():
                cost_all += time_all * len(TODO_LIST[flight_id][i]["todo"]["put"])
        return cost_all

def initialize_cost():
    ret = {}
    for i in range(NUM_OF_FLIGHT):
        content = [[float(0) for x in range(len(DIST))] for y in range(len(DIST))]
        for j in range(0, len(DIST)):
            for k in range(j+1, len(DIST)):
                content[j][k] = DIST[j][k] / SPEED_OF_FLIGHT
                content[k][j] = DIST[k][j] / SPEED_OF_FLIGHT
        ret[i] = content
    return deepcopy(ret)

def generate_vector():
    ret = []
    for i in range(NUM_OF_FLIGHT):
        tmp = [float(0) for x in range(len(POINT))]
        for j in range(len(POINT)):
            tmp[j] = math.sqrt(pow(POINT[j][0] - POSITION[i][0], 2) + pow(POINT[j][1] - POSITION[i][1], 2)) / SPEED_OF_FLIGHT
        ret.append(tmp)
    return deepcopy(ret)

def manage():
    global TODO_LIST, MISSION_B, CURRENT_COST
    init_center()
    cost = initialize_cost()
    cost_vector = generate_vector()
    for m in MISSIONS:
        TODO_LIST, MISSION_B, CURRENT_COST = handle(m, deepcopy(TODO_LIST), MISSION_A, deepcopy(MISSION_B), cost, cost_vector, NUM_OF_FLIGHT)
    for i in range(NUM_OF_FLIGHT):
        TODO_LIST[i] = small2big(deepcopy(TODO_LIST[i]))
    print(sum(CURRENT_COST))

def solve():
    global MISSIONS
    init_center()
    for m in MISSIONS:
        mission_id = m[0]
        sp = m[1]
        ep = m[2]
        flight_id = mission_id % NUM_OF_FLIGHT
        MISSION_B[flight_id].append(deepcopy(m))
        TODO_LIST[flight_id].append({"point": sp, "todo": {"get": [mission_id]}})
        TODO_LIST[flight_id].append({"point": ep, "todo": {"put": [mission_id]}})
    cost = generate_distance(deepcopy(POSITION))
    for i in range(NUM_OF_FLIGHT):
        CURRENT_COST[i] = generate_cost_current(deepcopy(cost[i]), i)

@app.route('/dev/', methods=['POST'])
def handle_client():
    tmp = request.get_data()
    tmp = tmp.decode(("utf-8"))
    if tmp[0]=="-":
        data = request.files['file'].read()
        file_content = data.decode("utf-8")
        first_line = file_content.splitlines()[0]
        # print(file_content)
        if len(first_line.split()) == 3 and first_line.split()[0].isdigit():
            global MISSIONS
            MISSIONS = []
            lines = file_content.splitlines()
            for line in lines:
                tmp = line.split()
                MISSIONS.append([int(tmp[0]), int(tmp[1]), int(tmp[2])])
            print(MISSIONS)
            message = "success"
            response_body = json.dumps({"status": message})
        else:
            response_body = json.dumps({"status": "fail"})
        return response_body
    else:
        input_from_ui = json.loads(tmp)
        t = input_from_ui["type"]
        if t==0:
            # print(input_from_ui)
            print("Optimization goal: {}".format(input_from_ui['select']))
            # print("Intel algo: {}".format(input_from_ui['switch']))
            global NUM_OF_FLIGHT, INTEL, MODEL
            NUM_OF_FLIGHT = input_from_ui['slider']
            INTEL = input_from_ui['switch']
            if input_from_ui['select'] == "最小化总等待时间":
                MODEL = 1
            response_body = json.dumps({"message": "save success", "model": MODEL})
            return response_body
        if t==1:
            print("planning...")
            if MODEL == 1:
                if INTEL:
                    manage()
                else:
                    solve()
                flight_mission = generate_flight_mission(NUM_OF_FLIGHT, deepcopy(MISSION_B), deepcopy(CURRENT_COST))
                flight_todolist = generate_flight_todolist(NUM_OF_FLIGHT, TODO_LIST)
                response_body = json.dumps({"todo_list": TODO_LIST, "position": POSITION, "flight_mission": flight_mission, "flight_todolist": flight_todolist})
                return response_body


if __name__ == '__main__':
    load_file()
    app.run(host='0.0.0.0', port=7000, debug=False)