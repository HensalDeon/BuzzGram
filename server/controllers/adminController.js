import UserModel from "../model/userModel.js";
import PostModel from "../model/postModel.js";
import ReportModel from "../model/reportModel.js";
import { activeUsers } from "../socket/index.js";

export const getUserList = async (req, res) => {
    try {
        const userList = await UserModel.find({}).exec();
        if (!userList) {
            return res.status(404).json({ error: "Error fetching user list!" });
        }
        return res.status(200).json(userList);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const blockUnblockUser = async (req, res) => {
    const { user } = req.body;

    try {
        const User = await UserModel.findById(user);
        if (!User.isblocked) {
            await User.updateOne({ isblocked: true });
            res.status(200).json("User blocked");
        } else {
            await User.updateOne({ isblocked: false });
            res.status(200).json("User Unblocked");
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

export const getDashboardData = async (req, res) => {
    try {
        const usersCount = await UserModel.find({}).count().exec();
        const postsCount = await PostModel.find({}).count().exec();
        const reportsCount = await ReportModel.find({}).count().exec();
        const totalUsersByMonth = await UserModel.aggregate([
            {
                $group: {
                    _id: {
                        $month: "$createdAt",
                    },
                    count: { $sum: 1 }, 
                },
            },
        ]);

        const usersByMonth = {
            labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
            data: new Array(12).fill(0),
        };

        if (totalUsersByMonth) {
            totalUsersByMonth.forEach((entry) => {
                const month = entry._id;
                usersByMonth.data[month - 1] = entry.count;
            });
        }
        const totalVisitsByMonth = await UserModel.aggregate([
            {
                $group: {
                    _id: {
                        $month: "$createdAt",
                    },
                    count: { $sum: "$visited" },
                },
            },
        ]);

        const visitedData = {
            title: "Visits",
            chartData: {
                labels: [],
                data: [],
            },
        };

        const monthsData = new Array(12).fill(0);
        if (totalVisitsByMonth) {
            totalVisitsByMonth.forEach((entry) => {
                const month = entry._id;
                monthsData[month - 1] = entry.count;
            });
        }

        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        for (let i = 0; i < 12; i++) {
            visitedData.chartData.labels.push(monthNames[i]);
            visitedData.chartData.data.push(monthsData[i]);
        }

        visitedData.value = monthsData.reduce((total, count) => total + count, 0);
        const activeUsersCount = activeUsers.length;

        const totalUsersCount = usersCount;

        function calculatePercent(value, total) {
            return total === 0 ? 0 : (value / total) * 100;
        }
        function calculatePercentWithin100(value) {
            const numericValue = parseFloat(value);

            if (!isNaN(numericValue)) {
                const percentage = (numericValue / 100) * 100;
                return Number(Math.min(Math.max(percentage, 0), 100).toFixed(2));
            }

            return 0;
        }

        const summaryData = [
            {
                title: "Users",
                subtitle: "Total Users",
                value: usersCount.toString(),
                percent: calculatePercentWithin100(usersCount),
            },
            {
                title: "Posts",
                subtitle: "Total Posts",
                value: postsCount.toString(),
                percent: calculatePercentWithin100(postsCount),
            },
            {
                title: "Reports",
                subtitle: "Total Reports",
                value: reportsCount.toString(),
                percent: calculatePercentWithin100(reportsCount),
            },
            {
                title: "Traffic",
                subtitle: "Total active users",
                value: activeUsersCount.toString(),
                percent: calculatePercent(activeUsersCount, totalUsersCount),
            },
        ];

        res.status(200).json({ summaryData, visitedData,usersByMonth });
    } catch (error) {
        console.log(error);
    }
};