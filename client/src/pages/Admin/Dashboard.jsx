import Box from "../../components/Box/Box";
import { Bar } from "react-chartjs-2";
import DashboardWrapper, {
    DashboardWrapperMain,
} from "../../components/DashboardWrapper/DashboardWrapper";
import SummaryBox, { SummaryBoxSpecial } from "../../components/SummaryBox/SummaryBox";
import { colors } from "../../constants";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { getDashboardData } from "../../api/AdminRequests";
import PacmanLoader from "react-spinners/PacmanLoader";
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

function Dashboard() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    const override = {
        position: "absolute",
        top: "45%",
        left: "45%",
        display: "block",
        zIndex: "1066",
    };

    useEffect(() => {
        const getSummaryData = async () => {
            setLoading(true);
            const response = await getDashboardData();
            if (response) {
                setLoading(false);
                setData(response.data);
            }
        };
        getSummaryData();
    }, []);
    return (
        <DashboardWrapper>
            <PacmanLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />
            <DashboardWrapperMain>
                {!loading && (
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                {data?.summaryData?.map((item, index) => (
                                    <div key={`summary-${index}`} className="col-lg-6 col-md-6 col-sm-12 mb">
                                        {!loading && data && <SummaryBox item={item} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-4 hide-sm">
                            {!loading && data && <SummaryBoxSpecial item={data?.visitedData} />}
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {!loading && data && (
                                    <Box>
                                        <UsersJoined data={data.usersByMonth} />
                                    </Box>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DashboardWrapperMain>
        </DashboardWrapper>
    );
}

export default Dashboard;

const UsersJoined = (data) => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
            },
            yAxes: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        elements: {
            bar: {
                backgroundColor: colors.orange,
                borderRadius: 20,
                borderSkipped: "bottom",
            },
        },
    };

    const chartData = {
        labels: data.data.labels,
        datasets: [
            {
                label: "Revenue",
                data: data.data.data,
            },
        ],
    };
    return (
        <>
            <div className="title mb">Users Joined </div>
            <div>
                <Bar options={chartOptions} data={chartData} height={`300px`} />
            </div>
        </>
    );
};
