import {Redirect} from 'expo-router';

export default function HomeScreen() {
    const auth = null;
    if(auth == null)
    {
        return <Redirect href="/login"/>
    }
    else
    {
        return <Redirect href="/home"/>
    }
}