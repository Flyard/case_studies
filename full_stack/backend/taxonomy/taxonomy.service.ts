import {TreeNode} from "./taxonomy.model";
import * as fs from "fs";
import * as path from "path";


const csvDataBuffer:string = fs.readFileSync(path.resolve(__dirname, '../taxonomy.csv'), "utf-8");
const rows:string[] = csvDataBuffer.split("\n").slice(1);

function createNode(level:number, topic: string, subtopic: string, label: string ): TreeNode {
    return {level, topic, subtopic, label, children:[]}
}

export function buildTree():TreeNode {
    const root: TreeNode = createNode(0, 'root', 'root', 'root');
    const currentNodes: Record<number, TreeNode> = {0:root}

    for(const row of rows) {
        const [levelString, topic , subtopic , label] = row.split(',');
        const level:number = parseInt(levelString);

        const newNode:TreeNode = createNode(level, topic, subtopic, label);
        const parentNode:TreeNode = currentNodes[level - 1];

        if(parentNode) {
            parentNode.children.push(newNode);
        }

        currentNodes[level] = newNode
    }

    return root
}
