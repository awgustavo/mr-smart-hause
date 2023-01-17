export const handler = async (event) => {
    console.log('Event: ', JSON.stringify(event))
  
    return {
        status: 200,
        body: 'default lambda'
    }
}