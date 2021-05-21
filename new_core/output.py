#!/usr/bin/env python
# _*_ coding:utf-8 _*_
from copy import deepcopy

def generate_flight_mission(n, mb, c):
    ret = []
    for i in range(n):
        tmp = {}
        tmp["key"] = str(i)
        tmp["id"] = str(i)
        tmp["mission"] = ""
        for j in range(len(mb[i])):
            tmp["mission"] += str(mb[i][j][0])
            if j < len(mb[i]) - 1:
                tmp["mission"] += " , "
        tmp["cost"] = "{:.2f}".format(c[i])
        ret.append(tmp)
    return deepcopy(ret)

def generate_flight_todolist(n, td):
    ret = []
    for i in range(n):
        tmp = {}
        tmp["key"] = str(i)
        tmp["id"] = str(i)
        tmp["list"] = ""
        for j in range(len(td[i])):
            tmp["list"] += " -> " + str(td[i][j]["point"]) + " : "
            tmp["list"] += "( "
            if "put" in td[i][j]["todo"].keys():
                tmp["list"] += "put : "
                for k in range(len(td[i][j]["todo"]["put"])):
                    tmp["list"] += str(td[i][j]["todo"]["put"][k]) + " "
            if "get" in td[i][j]["todo"].keys():
                tmp["list"] += "get : "
                for k in range(len(td[i][j]["todo"]["get"])):
                    tmp["list"] += str(td[i][j]["todo"]["get"][k]) + " "
            tmp["list"] += ")"
        ret.append(tmp)
    return deepcopy(ret)