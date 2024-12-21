export async function GET (){
  return new Response(
    "Nothing to see here😤",
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      }
    }
  )
}

export async function POST (){
  return new Response(
    JSON.stringify(
      {
        "response": "That was close... but not close enough😏"
      }
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      }
    }
  )
}

export async function PUT ({ request }){
  let data = {}
  // Try parsing the resquest body
  try{
    data = await request.json()
    // If successful, check if the needed parameters exist
    if("str" in data && "idx" in data && "length" in data){
      // Check if data is invalid
      if(typeof data.str !== 'string' || isNaN(Number(data.idx)) || isNaN(Number(data.length))){
        return new Response(
          JSON.stringify(
            {
              "response": "Your data is invalid, try other formats!"
            }
          ),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      }
      const str = data.str, idx = Number(data.idx)
      const flag = import.meta.env.SECRET_FLAG ?? process.env.SECRET_FLAG
      const newData = str + flag
      if(idx < 0){
        return new Response(
          JSON.stringify(
            {
              "response": "I start counting at 0, what do you think I am? A legacy system?"
            }
          ),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      }
      if(data.length <= idx){
        // If the index is out of bounds
        return new Response(
          JSON.stringify(
            {
              "response": "You caused an overflow!"
            }
          ),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      }
      if(newData.length <= idx){
        // If the index is out of bounds of the new data
        return new Response(
          JSON.stringify(
            {
              "response": "WHAT DID YOU DO? YOU JUST CAUSED AN OVERFLOW! ...How?"
            }
          ),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      }
      // If all checks went through
      return new Response(
        JSON.stringify(
          {
            "response": newData[idx]
          }
        ),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
    }
    // If not all parameters were present
    return new Response(
      JSON.stringify(
        {
          "response": "You're missing some parameters, I wonder what they are..."
        }
      ),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        }
      }
    )
  }catch(err){
    console.log(err)
    // Return no body was sent
    return new Response(
      JSON.stringify(
        {
          "response": "Phantom is a programmer, not omniscient, maybe give him some data?"
        }
      ),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        }
      }
    )
  }
}

export const prerender = false