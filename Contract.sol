pragma solidity ^0.8.0;

contract Contract{
    struct ticketData{
        string name;
        string age;
        string from;
        string to;
        string date;
        bool isDeleted;
    }
    mapping(address=>ticketData[]) Tickets;
    mapping(address=>uint256) count;
    address owner;

    constructor(){
        owner = msg.sender;
    }

    function addTicket(string calldata name, string calldata age,string calldata from,string calldata to, string calldata date) public{
        Tickets[msg.sender].push(ticketData(name,age,from,to,date,false));
        count[msg.sender]++;
    }

    function deleteTicket(uint256 index) public{
        Tickets[msg.sender][index].isDeleted = true;
    }

    function getTickets() public view returns(ticketData[] memory){
        ticketData[] memory temp = new ticketData[](count[msg.sender]+1);
        uint c = 0;
        for(uint i=0;i<count[msg.sender];i++){
            if(!Tickets[msg.sender][i].isDeleted){
                temp[c] = Tickets[msg.sender][i];
                c++;
            }
        }
        ticketData[] memory result = new ticketData[](c);
        for(uint i=0;i<c;i++){
            result[i] = temp[i];
        }
        return result;
    }
}
