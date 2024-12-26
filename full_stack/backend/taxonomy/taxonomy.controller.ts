// @ts-ignore
import express, {Router} from "express";
import {TreeNode} from "./taxonomy.model";
import {buildTree} from "./taxonomy.service";
export const taxonomyRouter = Router();


async function getTree(req:express.Request, res:express.Response):Promise<TreeNode>{
    const tree:TreeNode = buildTree();
    return res.status(200).send(tree)
}

async function getAnswers(req:express.Request, res:express.Response) {
    const body = await req.body;
    console.log(body)
    return res.status(200).send(body)
}

// @ts-ignore
taxonomyRouter.get('/', getTree)
taxonomyRouter.post('/', getAnswers)
