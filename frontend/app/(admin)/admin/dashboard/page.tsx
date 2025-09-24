// app/dashboard/page.tsx

import DashboardContainer from "@/containers/DashboardContainer";

export default function Dashboard() {
    // const { user } = useSelector((state: RootState) => state.auth);
    // const [profile, setProfile] = useState<any>(null);
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     api
    //         .get("/user/me")
    //         .then((res) => setProfile(res.data))
    //         .catch(() => dispatch(logout()));
    // }, [dispatch]);

    return (
      
      <DashboardContainer />
      
    );
}
