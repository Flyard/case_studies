'use client'
import axios from 'axios';
import { useEffect, useState, useCallback } from "react";
import { TreeNode } from "@/types/tree";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";



export default function Home() {
    const [tree, setTree] = useState<TreeNode | undefined>();
    const [selection, setSelection] = useState<string | null>(null);
    const [currentSubtopic, setCurrentSubtopic] = useState<string | null>(null);
    const [subtopicNodes, setSubtopicNodes] = useState<TreeNode[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});

    async function getTreeNode() {
        const treeReq = await axios.get('http://localhost:3001/tree');
        const treeData = await treeReq.data;
        setTree(treeData);
    }

    function cleanLabel(str: string) {
        return str.replace(/[^a-zA-Z0-9]/g, '_');
    }

    const topics = tree ? Array.from(new Set(tree.children.map((child) => child.topic))) : [];

    const getSubtopics = (tree: TreeNode, topic: string) => {
        let sub = new Set<string>();
        const traverse = (node: TreeNode) => {
            if (node.topic === topic && node.subtopic) {
                sub.add(node.subtopic);
            }
            if (node.children) {
                node.children.forEach(traverse);
            }
        };
        traverse(tree);
        return Array.from(sub);
    };

    const getSubtopicNodes = (tree: TreeNode, topic: string, subtopic: string): TreeNode[] => {
        const result: TreeNode[] = [];
        const traverse = (node: TreeNode) => {
            if (node.topic === topic && node.subtopic === subtopic) {
                result.push(node);
            }
            if (node.children) {
                node.children.forEach(traverse);
            }
        };
        traverse(tree);
        return result;
    };

    const handleSubtopicClick = (subtopic: string) => {
        if (tree && selection) {
            const nodes = getSubtopicNodes(tree, selection, subtopic);
            setCurrentSubtopic(subtopic);
            setSubtopicNodes(nodes);
        }
    };

    const handleAnswerChange = useCallback((id: string, value: string) => {
        // Only update the specific field, ensuring React doesn't have to re-render the entire component
        setAnswers(prevAnswers => {
            return { ...prevAnswers, [id]: value };
        });
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/tree', answers);
            alert("Answers submitted successfully!");
        } catch (error) {
            alert("Error submitting answers.");
        }
    };

    useEffect(() => {
        getTreeNode();
    }, []);

    function RecursiveQuestions({ nodes, path = '' }: { nodes: TreeNode[], path?: string }) {
        if (!nodes || nodes.length === 0) return <div>No questions available</div>;

        return (
            <div>
                {nodes.map((node, index) => {
                    const currentPath = path ? `${path}_${index}` : `${index}`;
                    const safeId = `${cleanLabel(node.label)}_${currentPath}`;

                    return (
                        <div key={safeId} style={{ marginBottom: "20px" }}>
                            <Label htmlFor={safeId}>{node.label}</Label>
                            <Textarea
                                key={safeId}
                                id={safeId}
                                placeholder="Type your answer here."
                                value={answers[node.label] || ""}
                                onChange={(e) => handleAnswerChange(node.label, e.target.value)}
                            />
                            {node.children?.length > 0 && (
                                <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                                    <RecursiveQuestions nodes={node.children} path={currentPath} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div>
            <h1 className="p-4 text-lg font-semibold">Topics</h1>
            <div className="flex flex-wrap gap-4 p-4">
                {topics.map((topic) => (
                    <Button
                        variant="outline"
                        key={topic}
                        onClick={() => {
                            setSelection(topic);
                            setCurrentSubtopic(null);
                            setSubtopicNodes([]);
                        }}
                    >
                        {topic}
                    </Button>
                ))}
            </div>

            {selection && tree && (
                <div>
                    <h2 className="p-4 text-lg font-semibold">Subtopics</h2>
                    <div className="flex flex-wrap gap-4 p-4">
                        {getSubtopics(tree, selection).map((sub) => (
                            <Button
                                variant="outline"
                                key={sub}
                                onClick={() => handleSubtopicClick(sub)}
                            >
                                {sub}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {currentSubtopic && subtopicNodes.length > 0 && (
                <div className="p-4">
                    <h2 className="text-lg font-semibold">Questions</h2>
                    <form onSubmit={handleSubmit}>
                        <RecursiveQuestions nodes={subtopicNodes} />
                        <div className="p-4">
                            <Button type="submit" variant="outline">Submit Answers</Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}