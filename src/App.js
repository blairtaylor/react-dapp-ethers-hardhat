import './App.css'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import TestMessage from './artifacts/contracts/TestMessage.sol/TestMessage.json'
import { Button, Container, Row, Col, Form } from 'react-bootstrap'

// Update with the contract address logged out to the CLI when it was deployed
const testMessageAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

function App() {
  // store message in local state
  const [localMessage, setLocalMessage] = useState('Test Message')
  const [messageEth, setMessageEth] = useState('')

  useEffect(() => {
    ;(async () => {
      await fetchMessage()
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
        testMessageAddress,
        TestMessage.abi,
        provider,
      )
      try {
        console.log('getting data...')
        const data = await contract.getTestMessage()
        console.log('data: ', data)
        setMessageEth(data)
        setLocalMessage(data)
      } catch (err) {
        console.log('Error: ', err)
      }
    } else {
      console.log("window.ethereum == 'undefined'")
    }
  }

  // call the smart contract, send an update
  async function updateMessage() {
    console.log('updateMessage called')
    try {
      if (!localMessage) return
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(JSON.stringify(TestMessage))
        const contract = new ethers.Contract(
          testMessageAddress,
          TestMessage.abi,
          signer,
        )
        console.log('contract address = ' + contract.address)
        console.log('contract resolvedAddress = ' + contract.resolvedAddress)
        console.log(
          'contract interface = ' + JSON.stringify(contract.interface),
        )
        console.log('new message = ' + localMessage)
        const transaction = await contract.setTestMessage(localMessage)
        await transaction.wait()
        fetchMessage()
      } else {
        console.log('window.ethereum !== undefined')
      }
    } catch (err) {
      console.log('An error occurred')
      console.log('Error: ', err)
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
            onSubmit={async () => {
              await updateMessage()
            }}
          >
            <Form.Group className="mb-3">
              <Row>
                <Col align="left">
                  <Form.Label>
                    <b>Current Message in State:</b> {localMessage}
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
                  <Form.Label htmlFor="inputNewMessage">
                    Enter a new message:
                  </Form.Label>
                  <Form.Control
                    id="inputNewMessage"
                    type="text"
                    placeholder=""
                    onChange={(e) => setLocalMessage(e.target.value)}
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
        </Container>
      </Container>
    </div>
  )
}

export default App
