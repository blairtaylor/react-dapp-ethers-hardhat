import './App.css'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/STToken.sol/STToken.json'
import { Button, Container, Row, Col, Form } from 'react-bootstrap'

// Update with the contract address logged out to the CLI when it was deployed
const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const tokenAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

function App() {
  // store message in local state
  const [greeting, setGreetingValue] = useState('Test Message')
  const [messageEth, setMessageEth] = useState('')
  const [userAccount, setUserAccount] = useState(
    '0x2546bcd3c84621e976d8185a91a922ae77ecec30',
  )
  const [amount, setAmount] = useState(10)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    ;(async () => {
      await fetchMessage()
      await getBalance()
    })()
  }, [])

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract, read the current greeting value
  async function fetchMessage() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider,
      )
      try {
        console.log('getting data...')
        const data = await contract.greet()
        console.log('data: ', data)
        setMessageEth(data)
        setGreetingValue(data)
      } catch (err) {
        console.log('Error: ', err)
      }
    } else {
      console.log("window.ethereum == 'undefined'")
    }
  }

  async function setGreeting() {
    console.log("In setGreeting...");
    console.log(greeting);
    console.log(window.ethereum);
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      try {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          greeterAddress,
          Greeter.abi,
          signer,
        )
        console.log('contract address = ' + contract.address)
        const transaction = await contract.setGreeting(greeting)
        console.log('transaction = ' + transaction)
        await transaction.wait()
        fetchMessage()
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      console.log('acount = ' + account)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account)
      console.log('Balance: ', balance.toString())
      setBalance(balance.toString())
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
      console.log('contract address in sendCoins = ' + contract.address)
      const transation = await contract.transfer(userAccount, amount)
      await transation.wait()
      console.log(`${amount} Coins successfully sent to ${userAccount}`)
    }
  }

  return (
    <div className="App">
      <Container>
        <Container className="p-5 mb-4 bg-light rounded-3">
          <h1 className="header">
            Welcome To An Ethereum HardHat ethers.js example
          </h1>
        </Container>
        <Container className="p-5 mb-4 bg-light rounded-3">
          <Form
            // onSubmit={async () => {
            //   await setGreeting()
            // }}
            onSubmit={setGreeting}
          >
            <Form.Group className="mb-3">
              <Row>
                <Col align="left">
                  <Form.Label>
                    <b>Current Message in State:</b> {greeting}
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col align="left">
                  <Form.Label>
                    <b>Current Message in Ethereum:</b> {messageEth}
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col align="left">
                  <Form.Label>
                    <b>Current Balance in Ethereum:</b> {balance}
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col align="left">
                  <Form.Label htmlFor="inputNewMessage">
                    Enter a new message:
                  </Form.Label>
                  <Form.Control
                    id="inputNewMessage"
                    type="text"
                    placeholder=""
                    onChange={(e) => setGreetingValue(e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>
            <Row>
              <Col align="left">
                <Button variant="primary" type="submit">
                  Set Message
                </Button>
              </Col>
            </Row>
          </Form>
          <Form
            onSubmit={sendCoins}
            // onSubmit={async () => {
            //   await sendCoins()
            // }}
          >
            <Form.Group className="mb-3 mt-3">
              <Row>
                <Col align="left">
                  <Form.Label htmlFor="inputSendCoins">
                    Number of tokens to send:
                  </Form.Label>
                  <Form.Control
                    id="inputSendCoins"
                    type="text"
                    // placeholder=""
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col align="left">
                  <Form.Label htmlFor="inputAccount">
                    Address to send tokens:
                  </Form.Label>
                  <Form.Control
                    id="inputAccount"
                    type="text"
                    value={userAccount}
                    onChange={(e) => setUserAccount(e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>
            <Row>
              <Col align="left">
                <Button variant="primary" onClick={getBalance}>
                  Get Balance
                </Button>
              </Col>
            </Row>
            <Row>
              <Col className="mt-3" align="left">
                <Button variant="primary" type="submit">
                  Send Coins
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </Container>
    </div>
  )
}

export default App
