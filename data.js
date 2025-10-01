// 朋友圈数据
const momentsData = [
    {
        id: 1,
        content: "好好好,claude也赶中国国庆发模型的节奏",
        value: 4,
        category: "科技数码",
        time: "2024-09-30 12:08",
        image: "4fb719adacb282987954bd1e5e5dcecf.png",
        likes: 0,
        comments: []
    },
    {
        id: 2,
        content: "真挤,回来时504人真多🥵,应该16点就出发的",
        value: 1,
        category: "生活日常",
        time: "2024-09-30 18:36",
        image: "",
        likes: 0,
        comments: []
    },
    {
        id: 3,
        content: "发国庆祝福时发现有一百多个单删我了。真正值得的人,会留在你的生活里;删掉你的人,也是在帮你腾出空间给更合拍的人;能坦诚交流、愿意回应的人才最值得投入精力——愿意回复与交流,意味着双方在意这段关系,信息透明,问题也更容易被及时解决;持续互动能在交流中碰撞观点、互相学习,让关系与个人都得到积极成长。",
        value: 5,
        category: "生活日常",
        time: "2024-10-01 00:16",
        image: "",
        likes: 0,
        comments: []
    },
    {
        id: 4,
        content: "疯狂动物城2电影11月来啦",
        value: 1,
        category: "生活日常",
        time: "2024-10-01 14:12",
        image: "",
        likes: 0,
        comments: []
    }
];

// 将数据保存到 localStorage
function saveMomentsData() {
    localStorage.setItem('momentsData', JSON.stringify(momentsData));
}

// 从 localStorage 加载数据
function loadMomentsData() {
    const saved = localStorage.getItem('momentsData');
    if (saved) {
        const loaded = JSON.parse(saved);
        momentsData.length = 0;
        momentsData.push(...loaded);
    }
}

// 初始化时加载数据
loadMomentsData();
