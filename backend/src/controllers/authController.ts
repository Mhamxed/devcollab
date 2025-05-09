import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user";
import ProblemModel from "../models/problem";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv"
dotenv.config()

const all = [
  {
    id: 1,
    title: "Two Sum",
    description: `
        Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
        You may assume that each input would have exactly one solution, and you may not use the same element twice.
        You can return the answer in any order.
    `,
    difficulty: "Easy",
    category: "Arrays",
    constraints: [
        "2 <= nums.length <= 104",
        "-109 <= nums[i] <= 109",
        "-109 <= target <= 109",
        "Only one valid answer exists."
        
    ],
    exampleCases: [
        {
            input: " nums = [2,7,11,15], target = 9",
            output: " [0,1]",
            Explanation: " Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
            input: " nums = [3,2,4], target = 6",
            output: " [1,2]",
        },
        {
            input: " nums = [3,3], target = 6",
            output: " [0,1]",
        },
    ],
    testCases: [
        {
            input: "{ nums: [4,5,6], target: 10 }",
            expectedOutput: "{ Output: [0,2] }",
        },
        {
            input: "{ nums: [3,4,5,6], target: 7 }",
            expectedOutput: "{ Output: [0,1] }",
        },
        {
            input: "{ nums: [5,5], target: 10 }",
            expectedOutput: "{ Output: [0,1] }",
        },
    ],
    defaultCode: {
        javascript: `function twoSum(nums, target) {}`,
        python: `def twoSum(self, nums: List[int], target: int) -> List[int]:`,
    },
    tags: ["Array", "Hash Table"]
  },
  {
    id: 2,
    title: "Binary Tree Level Order Traversal",
    description: `
    Given a binary tree root, return the level order traversal of it as a nested list, 
    where each sublist contains the values of nodes at a particular level in the tree, from left to right.
    `,
    difficulty: "Medium",
    category: "Trees",
    constraints: [
        "0 <= The number of nodes in both trees <= 1000.",
        "-1000 <= Node.val <= 1000"
    ],
    exampleCases: [
        {
            input: " root = [1,2,3,4,5,6,7]",
            output: " [[1],[2,3],[4,5,6,7]]",
        },
        {
            input: " root = [1]",
            output: " [[1]]",
        },
        {
            input: " root = []",
            output: " []",
        },
    ],
    testCases: [
        {
            input: "{ root: [1,2,3,4,5,6,7] }",
            expectedOutput: "{ Output: [[1],[2,3],[4,5,6,7]] }",
        },
        {
            input: "{ root: [1] }",
            expectedOutput: "{ Output: [[1]] }",
        },
        {
            input: "{ root: [] }",
            expectedOutput: "{ Output: [] }",
        },
    ],
    defaultCode: {
        javascript: ` 
        /**
        * Definition for a binary tree node.
        * class TreeNode {
        *     constructor(val = 0, left = null, right = null) {
        *         this.val = val;
        *         this.left = left;
        *         this.right = right;
        *     }
        * }
        */
        levelOrder(root) {}
        `,
        python: `
        # Definition for a binary tree node.
        # class TreeNode:
        #     def __init__(self, val=0, left=None, right=None):
        #         self.val = val
        #         self.left = left
        #         self.right = right

        def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        `,
    },
    tags: ["Tree", "BFS"]
  },
  {
    id: 3,
    title: "Merge K Sorted Lists",
    description: `
    You are given an array of k linked lists lists, where each list is sorted in ascending order.
    Return the sorted linked list that is the result of merging all of the individual linked lists.
    `,
    difficulty: "Hard",
    category: "Linked Lists",
    constraints: [
    "0 <= lists.length <= 1000",
    "0 <= lists[i].length <= 100",
    "-1000 <= lists[i][j] <= 1000"
  ],
    exampleCases: [
        {
            input: " lists = [[1,2,4],[1,3,5],[3,6]]",
            output: " [1,1,2,3,3,4,5,6]",
        },
        {
            input: " lists = []",
            output: " []",
        },
        {
            input: " lists = [[]]",
            output: " []",
        },
    ],
    testCases: [
        {
            input: "{ lists: [[1,2,4],[1,3,5],[3,6]] }",
            expectedOutput: "{ Output: [1,1,2,3,3,4,5,6] }",
        },
        {
            input: "{ lists: [] }",
            expectedOutput: "{ Output: [] }",
        },
        {
            input: "{ lists: [[]] }",
            expectedOutput: "{ Output: [] }",
        },
    ],
    defaultCode: {
        javascript: `
        /**
         * Definition for singly-linked list.
         * class ListNode {
         *     constructor(val = 0, next = null) {
         *         this.val = val;
         *         this.next = next;
         *     }
         * }
         */

        mergeKLists(lists) {}
        }
        `,
        python: `
        # Definition for singly-linked list.
        # class ListNode:
        #     def __init__(self, val=0, next=None):
        #         self.val = val
        #         self.next = next

        def mergeTwoLists(self, l1, l2):
        `,
    },
    tags: ["LinkedList", "Heap"]
  },
  {
    id: 4,
    title: "Valid Parentheses",
    description: `
    You are given a string s consisting of the following characters: '(', ')', '{', '}', '[' and ']'.
    The input string s is valid if and only if:
    Every open bracket is closed by the same type of close bracket.
    Open brackets are closed in the correct order.
    Every close bracket has a corresponding open bracket of the same type.
    Return true if s is a valid string, and false otherwise.
    `,
    difficulty: "Easy",
    category: "Stacks",
    constraints: [
        "1 <= s.length <= 1000"
    ],
    exampleCases: [
        {
            input: ` s = "[]"`,
            output: " true",
        },
        {
            input: ` s = "([{}])"`,
            output: " true",
        },
        {
            input: ` s = "[(])"`,
            output: " false",
        },
    ],
    testCases: [
        {
            input: "{ s: [] }",
            expectedOutput: "{ Output: true }",
        },
        {
            input: "{ s: ([{}]) }",
            expectedOutput: "{ Output: true }",
        },
        {
            input: "{ s: [(]) }",
            expectedOutput: "{ Output: false }",
        },
    ],
    defaultCode: {
        javascript: `
        isValid(s) {}
        `,
        python: `
        def isValid(self, s: str) -> bool:
        `,
    },
    tags: ["Stack", "String"]
  },
  {
    id: 5,
    title: "LRU Cache",
    description: `
    Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

    Implement the LRUCache class:
    LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
    int get(int key) Return the value of the key if the key exists, otherwise return -1.
    void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.
    The functions get and put must each run in O(1) average time complexity.
    `,
    difficulty: "Medium",
    category: "Design",
    constraints: [
        "1 <= capacity <= 3000",
        "0 <= key <= 104",
        "0 <= value <= 105",
        "At most 2 * 105 calls will be made to get and put."

    ],
    exampleCases: [
        {
            input: ` ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
                    [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]`,
            output: " [null, null, null, 1, null, -1, null, -1, 3, 4]",
            Explanation: ` LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4`
        },
    ],
    testCases: [
        {
            input: `["LRUCache","put","put","get","put","get","put","get","get","get"]`,
            expectedOutput: "{ [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]] }",
        },
    ],
    defaultCode: {
        javascript: `
        /**
         * @param {number} capacity
         */
        var LRUCache = function(capacity) {
            
        };

        /** 
         * @param {number} key
         * @return {number}
         */
        LRUCache.prototype.get = function(key) {
            
        };

        /** 
         * @param {number} key 
         * @param {number} value
         * @return {void}
         */
        LRUCache.prototype.put = function(key, value) {
            
        };

        /** 
         * Your LRUCache object will be instantiated and called as such:
         * var obj = new LRUCache(capacity)
         * var param_1 = obj.get(key)
         * obj.put(key,value)
         */
        `,
        python: `
        class LRUCache:

        def __init__(self, capacity: int):
            

        def get(self, key: int) -> int:
            

        def put(self, key: int, value: int) -> None:


        # Your LRUCache object will be instantiated and called as such:
        # obj = LRUCache(capacity)
        # param_1 = obj.get(key)
        # obj.put(key,value)
        `,
    },
    tags: ["Hash Table", "Design"]
  },
  {
    id: 6,
    title: "Word Break",
    description: `
    Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.
    Note that the same word in the dictionary may be reused multiple times in the segmentation.
    `,
    difficulty: "Medium",
    category: "Dynamic Programming",
    constraints: [
        "1 <= s.length <= 300",
        "1 <= wordDict.length <= 1000",
        "1 <= wordDict[i].length <= 20",
        "s and wordDict[i] consist of only lowercase English letters.",
        "All the strings of wordDict are unique."
    ],
    exampleCases: [
        {
            input: ` s = "leetcode", wordDict = ["leet","code"]`,
            output: " true",
            Explanation: ` Return true because "leetcode" can be segmented as "leet code".`
        },
        {
            input: ` s = "applepenapple", wordDict = ["apple","pen"]`,
            output: " true",
            Explanation: ` Return true because "applepenapple" can be segmented as "apple pen apple".
Note that you are allowed to reuse a dictionary word.
            `
        },
        {
            input: ` s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]`,
            output: " false",
        },
    ],
    testCases: [
        {
            input: "{ s: [] }",
            expectedOutput: "{ Output: true }",
        },
        {
            input: "{ s: ([{}]) }",
            expectedOutput: "{ Output: true }",
        },
        {
            input: "{ s: [(]) }",
            expectedOutput: "{ Output: false }",
        },
    ],
    defaultCode: {
        javascript: `
        function wordBreak (s, wordDict) {
        `,
        python: `
        def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        `,
    },
    tags: ["DP", "String"]
  }
]

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { firstname, lastname, username, password } = req.body;
    const existing = await UserModel.findOne({ username });

    if (existing) return res.status(400).json({ error: "username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new UserModel({ firstname, lastname, username, password: hashed });

    const token = jwt.sign({ id: user._id, username: user.username}, process.env.SECRET_KEY!, { expiresIn: "360h" });
    for (let problem of all) {
      const newProblem = new ProblemModel ({
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        category: problem.category,
        constraints: problem.constraints,
        exampleCases: problem.exampleCases,
        testCases: problem.testCases,
        defaultCode: problem.defaultCode,
        createdBy: user._id,
        tags: problem.tags,
      })
      await newProblem.save()
    }
    await user.save();
    res.status(201).json({ message: "User registered successfully", token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const login = async (req: Request, res: Response): Promise<any> => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username });
  
      if (!user) return res.status(404).json({ error: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY!, { expiresIn: "360h" });
      res.status(200).json({ user, token, message: "Logged in successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const logout = (req: Request, res: Response) => {
  res.json({ message: "logged out successfully" });
};
