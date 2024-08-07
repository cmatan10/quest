import React, { useState, useRef, useContext, useEffect } from 'react';
import SocialNetworkShare from '../components/SocialNetworkShare.js'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../Web3Context';
import InstanceABI from '../interfaces/DecodeData.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';
function Game13() {
  const [_str, set_str] = useState("");
  const [_num, set_num] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const hintLink = 'https://web3js.readthedocs.io/en/v1.7.1/web3-eth-abi.html#decodeparameters'
  const [_encodeStringAndUint, setEncodeStringAndUint] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const toggleHint = () => {
    setIsHintVisible(!isHintVisible);
  };

  useEffect(() => {
    if (web3.utils.isAddress(InstanceAddress)) {
      setInstanceContract(new web3.eth.Contract(InstanceABI, InstanceAddress));
    }
  }, [InstanceAddress]);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress || !nftContract) {
        return;
      }
      const balance = await nftContract.methods.balanceOf(walletAddress, 13).call();
      setTokenBalance(balance);
      console.log(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true);
      const receipt = await factoryContract.methods.deploy(13).send({
        from: walletAddress,
        gas: 800000,
      });
      const blockNumber = await web3.eth.getBlockNumber();
      await factoryContract.getPastEvents('DeployInstance', {
        filter: { sender: walletAddress },
        fromBlock: blockNumber - 900, toBlock: 'latest'
      }, async (error, events) => {
        for (let index = 0; index < events.length; index++) {
          if (receipt.transactionHash === events[index].transactionHash) {
            setInstanceAddress(events[index].returnValues.Instance);
          }
        }
      });
      setIsLoading(false);
      toast.success("Game created successfully!");
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error("Game creation failed. Please make sure your Metamask wallet is properly connected.");
    }
  };

  const decode = async (_str, _num) => {
    if (instanceContract) {
      if (isNaN(Number(_num))) {
        alert('Invalid input! Please enter a number.');
        return;
      }
      try {
        await instanceContract.methods.decode(_str, _num).send({
          from: walletAddress,
          gas: 700000,
        }).then(async () => {
          console.log('The Mission Is Complete');
          toast("Well done! You have solved this level!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
          if (TokenBalance < 1) {
            try {
              console.log(TokenBalance);

              await nftContract.methods.mint(13, InstanceAddress).send({
                from: walletAddress,
                gas: 700000,
              })
                .once("error", (err) => {
                  console.log(err);
                  toast.error("Minting failed."); // Error toast
                })
                .once("receipt", async () => {
                  const balance = await nftContract.methods.balanceOf(walletAddress, 13).call();
                  setTokenBalance(balance);
                  console.log(balance);
                  toast.success("Minting completed successfully!"); // Success toast
                });
            } catch (err) {
              console.error(err.message);
              toast.error("Minting failed."); // Error toast
            }
          }
        })
      } catch (err) {
        console.error(err.message);
        toast.error("Encoding failed."); // Error toast
      }
    }
  };

  const encodeStringAndUint = async () => {
    const encode = await instanceContract.methods.encodeStringAndUint().call()
    console.log(encode);
    setEncodeStringAndUint(encode);
  }

  const player = async () => {
    const play = await instanceContract.methods.player().call()
    console.log(play);
    setPlayerState(play);
  }
  const code = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.10;
  
  contract DecodeData{
      bytes public encodeStringAndUint =hex"00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000b4920416d204e756d626572000000000000000000000000000000000000000000";
       
      struct Player{
         string _string;
         uint256 _number;
      }
      Player public player;
  
      function decode(string memory _str, uint256 _num) external {
          bytes memory encodedData = abi.encode(_str, _num);
          require(keccak256(encodedData) == keccak256(encodeStringAndUint), "The Answer is incorrect");
          player = Player(_str, _num);
      }
  }
  `;

  return (
    <>
      <Container className="game-container container-padding-fix">
        <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
          <CardBody>
            <CardTitle className="game-title title-color" ><b>Decode Data Learning Lab</b></CardTitle>
            <div className="code-section">
              <CopyToClipboard text={code}>
                <Button className="button-copy">
                  Copy code
                </Button>
              </CopyToClipboard>
              <SyntaxHighlighter language="javascript" style={a11yDark} ref={codeRef}>
                {code}
              </SyntaxHighlighter>
            </div>
          </CardBody>
        </Card>

        <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
          <CardBody>
            <CardTitle className="card-title title-color" ><b>Game Description</b></CardTitle>
            <p><b>Master data decryption in Solidity. Decode and pass data with precision.</b>
              <br /><br />
              <b><strong> You need:</strong> To complete this mission, you need to be familiar with the abi.encode function for encoding data in Solidity, understand how the keccak256 hash function works, and use these tools to decode data. </b>
            </p>
            <div>
              <Button style={{ backgroundColor: '#c97539', color: 'white' }} className="button-margin" onClick={createGame}>
                Create Instance
              </Button>
            </div>
          </CardBody>
        </Card>

        {!isLoading && InstanceAddress !== "" && (
          <>
            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
                <CardTitle className="card-title title-color" ><b>State Variables</b></CardTitle>

                <Button style={{ backgroundColor: '#355f7d', color: 'white' }} className="mt-1" onClick={encodeStringAndUint}>
                  encodeStringAndUint
                </Button>
                {_encodeStringAndUint !== null &&
                  <p style={{ wordBreak: "break-all" }}> {JSON.stringify(_encodeStringAndUint)}</p>}
                <br />

                <div style={{ display: 'flex', alignItems: 'center' }}>

                  <Button style={{ backgroundColor: '#355f7d', color: 'white' }} className="mt-1" onClick={player}>
                    player
                  </Button>
                  {playerState !== null &&
                    <p style={{ marginLeft: '10px', marginTop: '12px', wordBreak: "break-all" }}>{JSON.stringify(playerState)}</p>}
                </div>
                <Button style={{ backgroundColor: '#355f7d', color: 'white' }} className="button" onClick={toggleHint}>
                  {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                </Button>
                {isHintVisible && (
                  <Card className="card" style={{ backgroundColor: '#000000', color: 'white' }}>
                    <CardBody>
                      <CardTitle className="card-title title-color" ><b>Hint</b></CardTitle>
                      <p>
                        <strong>Use the decodeparameters function from the web3js library. You can read more </strong> <a style={{ textDecoration: "underline" }} href={hintLink} target="_blank" rel="noopener noreferrer"><strong>Here</strong></a>.
                        <br />
                        <strong><strong>Or</strong></strong>
                        <br />
                        <strong>Write a function according to the following interface:<br /> <strong> function decode(bytes memory encodedData) external pure returns (string memory, uint256);</strong></strong>
                      </p>
                    </CardBody>
                  </Card>
                )}
              </CardBody>
            </Card>

            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
                <h3 className="mt-1 title-color" >Your Test Address: <p className="Instance-color"> {InstanceAddress} </p></h3>
                <FormGroup>
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="_str"
                    type="text"
                    onChange={(e) => set_str(e.target.value)}
                  />
                  <br />
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="_num"
                    type="text"
                    onChange={(e) => set_num(e.target.value)}
                  />
                </FormGroup>
                <Button style={{ backgroundColor: '#c97539', color: 'white' }} className="mt-1" onClick={() => decode(_str, _num)}>
                  decode
                </Button>
              </CardBody>
            </Card>
          </>
        )}


        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {TokenBalance < 1 ? null : (
            <div>

              <strong>
                Congratulations! You Got A Badge{" "}
                <i className="fas fa-medal" style={{ color: "gold", fontSize: "20px", position: 'relative', top: '3px' }}></i>
              </strong>
              <br /><br />
              <SocialNetworkShare description={'Decode Data'} />
            </div>
          )}
        </p>
      </Container>

      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
    </>
  );


}

export default Game13;
