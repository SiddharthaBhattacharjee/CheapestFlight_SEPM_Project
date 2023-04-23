import './App.css';
import metamaskimg from './images/metamask.png';
import React, { useRef, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from 'ethers';
import Top from './components/Top';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import data from './utils/data';
import VoteAbi from './utils/Contract.json';
import { VoteContractAddress } from './config.js';


function App() {

  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bengaluru', 'Hyderabad', 'Jaipur', 'Lucknow', 'Ahmedabad', 'Pune'];
  const dateInputRef = useRef(null);
  const [currentAccount, setCurrentAccount] = useState(''); //fetched from metamask
  const [correctNetwork, setCorrectNetwork] = useState(false); //fetched from metamask
  const [isResult, setIsResult] = useState(false);
  const [resPath, setResPath] = useState([]);
  const [resPrice, setResPrice] = useState('');
  const [resDate, setResDate] = useState([]);

  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [date, setDate] = useState('');
  const [proceed, setProceed] = useState(false);
  const [Name, setName] = useState('');
  const [Age, setAge] = useState('');

  function cheapestFlight(start, end, flights) {
    // Create a map to store the cheapest cost to reach each node
    const cheapestCosts = new Map([[start, 0]]);
    // Create a map to store the parent of each node in the cheapest path
    const parents = new Map([[start, null]]);
    // Create a priority queue to store nodes to be visited, ordered by cheapest cost
    const queue = [[0, start]];

    while (queue.length > 0) {
      // Get the node with the cheapest cost
      const [cost, node] = queue.shift();

      // If we've reached the end node, return the cheapest cost and path
      if (node === end) {
        const path = [end];
        let parent = parents.get(end);
        while (parent !== null) {
          path.push(parent);
          parent = parents.get(parent);
        }
        return [cost, path.reverse()];
      }

      // Check each neighbor of the current node
      for (const [neighbor, neighborCost] of Object.entries(flights[node] || {})) {
        // Calculate the cost to reach the neighbor
        const totalCost = cost + neighborCost;
        // If this is the cheapest cost to reach the neighbor so far, update the maps and queue
        if (!cheapestCosts.has(neighbor) || totalCost < cheapestCosts.get(neighbor)) {
          cheapestCosts.set(neighbor, totalCost);
          parents.set(neighbor, node);
          queue.push([totalCost, neighbor]);
        }
      }
      queue.sort((a, b) => a[0] - b[0]);
    }

    // If we've searched all reachable nodes and haven't found the end node, there is no path
    return [Infinity, []];
  }


  const handleChangeFrom = (event) => {
    setFrom(event.target.value);
  }

  const handleChangeTo = (event) => {
    setTo(event.target.value);
  }

  const handleChangeDate = (e) => {
    setDate(e.target.value);
  };

  const handleProceed = () => {
    setProceed(true);
  }

  const handleName = (e) => {
    setName(e.target.value);
  }

  const handleAge = (e) => {
    setAge(e.target.value);
  }




  const searchEvent = () => {
    const [cost, path] = cheapestFlight(from, to, data);
    setResPath(path);
    setResPrice(cost);
    setIsResult(true);
  }

  const convertPath = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
      str += arr[i];
      if (i !== arr.length - 1) {
        str += ' -> ';
      }
    }
    return str;
  }


  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Metamask Not Found ! Get MetaMask and Try Again.');
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });

      const shardeumChainId = '0x1f91';
      if (chainId !== shardeumChainId) {
        alert('Please Connect to shardeum Testnet');
        return;
      }
      else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const bookTicket = async () => {
    if(!Name || !Age || !from || !to || !date){
      alert('Please fill all the fields');
      return;
    }

    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log('signer : ', signer);
        const VoteContract = new ethers.Contract(VoteContractAddress, VoteAbi.abi, signer);
        console.log('VoteContract : ', VoteContract);
        //calling the smart contract
        let strdate = date.toString();

        VoteContract.addTicket(Name,Age,from,to,strdate).then(
          response => {
            console.log('toggleVotingEnabled : ', response);
          }
        ).catch(err => {
          console.log(err);
        });

      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  const Register = async () => {
    window.open('https://metamask.io', '_blank');
  }

  return (
    <div>
      {currentAccount === '' ? (
        <div className="loading" style={{ width: "100%", height: "100vh", display: 'flex', alignItems: "center", justifyContent: "space-evenly", flexDirection: "column" }}>
          <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div className="Metabit">FlightChain</div>
            <div className="SubMetabit">Finding Cheap Flight made Easy with Blockchain</div>
          </div>
          <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
            <div className='connectWalletButton' onClick={connectWallet}>
              Login With <img src={metamaskimg} alt="metamask" /> MetaMask
            </div>
            <div className="SubConnectWallet" onClick={Register}>Register</div>
          </div>

        </div>
      ) : !correctNetwork ? (
        <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "26px",
            width: "100%",
            height: "100vh"
          }}>
          <div>-----------------------------------------</div>
          <div>Please connect to the shardeum Testnet</div>
          <div>and reload the page</div>
          <div>-----------------------------------------</div>
        </div>
      ) : (
        <>
          <Top uid={currentAccount} />
          <div className="AppMain">
            <h1
              style={{
                color: 'white',
              }}
            >Search Flight</h1>
            <div className="Booker">
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  display: 'flex',
                  width: '70%',
                }}>
                  <FormControl required variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-required-label" style={{ color: 'white' }}>FROM</InputLabel>
                    <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={from}
                      label="FROM *"
                      onChange={handleChangeFrom}
                      inputProps={{ style: { color: 'white' } }}
                      sx={{
                        '& .MuiSelect-icon': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'white'
                        },
                        color: 'white'
                      }}
                    >
                      <MenuItem value="">
                        <em style={{ color: 'black' }}>None</em>
                      </MenuItem>
                      {cities.map((city) => (
                        <MenuItem value={city} key={city}>{city}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl required variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-required-label" style={{ color: 'white' }}>TO</InputLabel>
                    <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={to}
                      label="TO *"
                      onChange={handleChangeTo}
                      inputProps={{ style: { color: 'white' } }}
                      sx={{
                        '& .MuiSelect-icon': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'white'
                        },
                        color: 'white'
                      }}
                    >
                      <MenuItem value="">
                        <em style={{ color: 'black' }}>None</em>
                      </MenuItem>
                      {cities.map((city) => (
                        <MenuItem value={city} key={city}>{city}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <input
                    type="date"
                    onChange={handleChangeDate}
                    ref={dateInputRef}
                    className="dateInput"
                  />
                </div>
                <button className='searchButton' onClick={searchEvent}>Search</button>
              </div>

              {isResult ? (
                <div style={{
                  color: 'white',
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  width: '100%',
                  flexDirection: 'column'
                }}>
                  <div className='Result' style={{
                    color: 'white',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    width: '70%',
                    flexDirection: 'column'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                      <h3>Best Route:</h3>
                      <p style={{ padding: '10px' }}>{convertPath(resPath)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                      <h3>Total Cheapest Cost:</h3>
                      <p style={{ padding: '10px' }}>{resPrice}</p>
                    </div>
                  </div>
                  <div style={{
                    color: 'white',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    width: '100%',
                  }}>
                    <div className='Result' style={{
                      color: 'white',
                      marginTop: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      width: '70%',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                        <h3>Name :</h3>
                        <input type="text" placeholder="Enter Name"
                          style={{
                            padding: '10px',
                            background: 'transparent',
                            border: '1px solid white',
                            borderRadius: '5px',
                            color: 'white',
                            marginLeft: '10px'
                          }}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                        <h3>Age:</h3>
                        <input type="text" placeholder="Enter Age"
                          style={{
                            padding: '10px',
                            background: 'transparent',
                            border: '1px solid white',
                            borderRadius: '5px',
                            color: 'white',
                            marginLeft: '10px'
                          }}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='Result' style={{
                      color: 'white',
                      marginTop: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      width: '30%',
                    }}>
                      <button className='searchButton' onClick={bookTicket}>Book</button>
                    </div>
                  </div>
                </div>

              ) : null}
                </div>
          </div>
          </>
      )}
        </div>
      );
}

      export default App;

