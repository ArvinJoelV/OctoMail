
import useEmails from "./useEmails";

function useAnalytics() {

    const { emails } = useEmails();

    // Total Emails

    const totalEmails = emails.length;

    // High Priority Emails

    const highPriorityEmails =
        emails.filter(
            email =>
                email.priority?.toLowerCase() === "high"
        ).length;

    // Pending Tasks

    const pendingTasks =
        emails.reduce(
            (count, email) =>
                count +
                (
                    email.tasks?.length || 0
                ),
            0
        );

    // Categories

    const categoryCounts = {};

    emails.forEach(email => {

        const category =
            email.category?.toLowerCase()
            || "other";

        categoryCounts[category] =
            (
                categoryCounts[category]
                || 0
            ) + 1;

    });

    const categoryData =
        Object.entries(categoryCounts)
            .map(
                ([name, value]) => ({
                    name,
                    value
                })
            );

    // Activity Trend

    const activityMap = {};

    emails.forEach(email => {

        if (!email.receivedAt) {
            return;
        }

        const date =
            new Date(email.receivedAt)
                .toISOString()
                .split("T")[0];

        activityMap[date] =
            (
                activityMap[date]
                || 0
            ) + 1;

    });

    const activityData =
        Object.entries(activityMap)
            .map(
                ([date, count]) => ({
                    date,
                    count
                })
            )
            .sort(
                (a, b) =>
                    new Date(a.date)
                    -
                    new Date(b.date)
            );

    // Priority Distribution

    const priorityData = [

        {
            name: "high",
            value:
                emails.filter(
                    email =>
                        email.priority?.toLowerCase()
                        === "high"
                ).length
        },

        {
            name: "medium",
            value:
                emails.filter(
                    email =>
                        email.priority?.toLowerCase()
                        === "medium"
                ).length
        },

        {
            name: "low",
            value:
                emails.filter(
                    email =>
                        email.priority?.toLowerCase()
                        === "low"
                ).length
        }

    ];

    // Top Senders

    const senderCounts = {};

    emails.forEach(email => {

        if (!email.sender) {
            return;
        }

        senderCounts[email.sender] =
            (
                senderCounts[email.sender]
                || 0
            ) + 1;

    });

    const topSenders =
        Object.entries(senderCounts)
            .map(
                ([sender, count]) => ({
                    sender,
                    count
                })
            )
            .sort(
                (a, b) =>
                    b.count - a.count
            )
            .slice(0, 10);
    
    
const taskDeadlineData = [];

emails.forEach(email => {

    if(
        !email.tasks ||
        email.tasks.length === 0
    ){
        return;
    }

    email.tasks.forEach(task => {

        taskDeadlineData.push({

            task,

            deadline:
                email.deadlines?.[0]
                || "No Deadline",

            priority:
                email.priority
                || "low",

            subject:
                email.subject

        });

    });

});

    const now = new Date();
    const overdueTasks = taskDeadlineData.filter(item => {
        if (!item.deadline || item.deadline === "No Deadline") return false;
        const d = new Date(item.deadline);
        return !isNaN(d.getTime()) && d < now;
    }).length;

    return {
        totalEmails,
        highPriorityEmails,
        pendingTasks,
        overdueTasks,
        categoryData,
        activityData,
        priorityData,
        topSenders,
        taskDeadlineData
    };

}

export default useAnalytics;