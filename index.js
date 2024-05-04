const express = require('express')
const uuid = require('uuid')
const port = 3000

const app = express()
app.use(express.json())

const orders = []

const checkOrders = (request, response, next) => {

    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checktUrl = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)

    next()
}

app.post('/order', (request, response) => {
    const { order, clientName, price, status } = request.body

    const orderId = { id: uuid.v4(), order, clientName, price, status }

    orders.push(orderId)

    return response.status(201).json(orderId)

})

app.get('/orders', (request, response) => {

    return response.json(orders)
})

//relate specific order by ID
app.get('/orderId/:id', checkOrders, (request, response) => {

    const { id } = request.params

    const found = orders.find(order => order.id === id)


    return response.json(found)
})

app.put('/updateOrder/:id', checkOrders, (request, response) => {

    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrders = { id, order, clientName, price, status }

    orders[index] = updatedOrders

    return response.json(updatedOrders)
})

app.patch('/updateStatus/:id', checkOrders, checktUrl, (request, response) => {
    const { order, clientName, price } = request.body
    const id = request.orderId
    const index = request.orderIndex
    const orderReady = {
        id,
        order: orders[index].order,
        clientName: orders[index].clientName,
        price: orders[index].price,
        status: "Pronto"
    }

    orders[index] = orderReady

    return response.json(orderReady)
})

app.delete('/orders/:id', (request, response) => {

    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })
    }

    orders.splice(index, 1)

    return response.status(204).json({ message: "Deleted user" })
})


//porta
app.listen(port, () => {
    console.log("🚀 Server started on port 3000 🚀")
})