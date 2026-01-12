import {IRingoverGroup} from "../types/ringover.types"
 
export async function getRingoverGroups (apiKey: string): Promise<IRingoverGroup[]>{

    try {
        var res = await fetch(`https://public-api.ringover.com/v2/groups`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${apiKey}`
            }}
                )
        //if status is 401 then throw error
        if (res.status === 401) {
            throw new Error('Unauthorized')
        }
        var resJson = (await res.json()) as {
          list_count: number;
          list: IRingoverGroup[];
        };

        return resJson.list
    }catch(e) {
        throw new Error(e)
    }
}