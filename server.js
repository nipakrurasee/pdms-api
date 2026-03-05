import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

const EMAIL = "one-two-call@hotmail.com"
const PASSWORD = "7b0d4763dd850257c5cc9d07eecb18b4"

app.post("/pdms", async (req, res) => {

    try {

        const msg = req.body.msg

        // LOGIN
        const login = await fetch("https://fids.police.go.th/pdms/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: EMAIL,
                password: PASSWORD
            })
        })

        const loginData = await login.json()

        const token = loginData.token

        if (!token) {
            return res.status(500).json({error:"login failed"})
        }

        // CALL PDMS
        const pdms = await fetch("https://fids.police.go.th/pdms/api/other/getDna", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token,
                msg: msg
            })
        })

        const data = await pdms.json()

        res.json(data)

    } catch (err) {

        res.status(500).json({
            error: err.toString()
        })

    }

})

app.get("/", (req,res)=>{
    res.send("PDMS API RUNNING")
})

app.listen(10000, ()=>{
    console.log("server started")
})
