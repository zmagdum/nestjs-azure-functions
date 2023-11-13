module.exports = async function (context, req) {

    const responseMessage = 'dogs'
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    }
}