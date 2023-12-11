// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicketing is ERC721Enumerable, Ownable {
    struct Event {
        uint256 id;
        string name;
        uint256 dateTimestamp;
        string location;
        string imageCoverUri;
        uint256 ticketLimit;
        uint256 ticketsIssued;
        uint256 ticketPrice;
        bool isClosed;
    }
    struct Ticket {
        uint256 id;
        uint256 eventId;
        bool isUsed;
    }
    bool private locked;
    uint256 public nextEventId;
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;

    constructor() ERC721("EventTicket", "ETKT") Ownable(msg.sender) {
        nextEventId=0;
    }

    modifier nonReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }


    function createEvent(
        string memory name,
        uint256 dateTimestamp,
        string memory location,
        string memory imageCoverUri,
        uint256 ticketLimit,
        uint256 ticketPrice
    ) public onlyOwner {
        events[nextEventId] = Event(
            nextEventId,
            name,
            dateTimestamp,
            location,
            imageCoverUri,
            ticketLimit,
            0,
            ticketPrice,
            false
        );
        nextEventId++;
    }

    function purchaseTickets(uint256 eventId, uint256 quantity) public payable nonReentrant {
        require(eventId < nextEventId, "Event does not exist");
        Event storage eventItem = events[eventId];
        require(
            eventItem.ticketsIssued + quantity <= eventItem.ticketLimit,
            "Not enough tickets available"
        );
        require(
            eventItem.isClosed == false,
            "Event has been closed"
        );
        uint256 totalPrice = eventItem.ticketPrice * quantity;
        require(msg.value == totalPrice, "Incorrect amount of ETH sent");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 ticketId = totalSupply();
            _mint(msg.sender, ticketId);
            tickets[ticketId] = Ticket(ticketId,eventId, false);
            eventItem.ticketsIssued++;
        }
    }

    function useTicket(uint256 ticketId, uint256 eventId) public onlyOwner {
        require(ticketId <= totalSupply(), "Ticket does not exist");
        require(eventId < nextEventId, "Event does not exist");
        Ticket storage ticketItem = tickets[ticketId];
        require(!ticketItem.isUsed, "Ticket already used");
        require(
            ticketItem.eventId == eventId,
            "Ticket does not belong to the event"
        );

        ticketItem.isUsed = true;
    }

    function withdraw() public onlyOwner nonReentrant {
        payable(msg.sender).transfer(address(this).balance);
    }

    function toggleEvent(uint256 eventId, bool _isClosed) public onlyOwner {
        require(eventId < nextEventId, "Event does not exist");
        Event storage eventItem = events[eventId];
        eventItem.isClosed = _isClosed;
    }
    function viewOpenEvents() public view returns (Event[] memory) {
        uint256 count = 0;

        // count the open events
        for (uint256 i = 0; i < nextEventId; i++) {
            if (!events[i].isClosed) {
                count++;
            }
        }
        // create an array and fill it with open events
        Event[] memory openEvents = new Event[](count);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < nextEventId; i++) {
            if (!events[i].isClosed) {
                openEvents[currentIndex] = events[i];
                currentIndex++;
            }
        }

        return openEvents;
    }

    function viewAllEvents() public view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](nextEventId);
        for (uint256 i = 0; i < nextEventId; i++) {
            allEvents[i] = events[i];
        }
        return allEvents;
    }


    function viewUserTickets() public view returns (Ticket[] memory) {
        address owner = msg.sender;
        uint usersBalance = balanceOf(owner);
        Ticket[] memory userTickets = new Ticket[](usersBalance);
        if(usersBalance > 0) {
            for(uint256 i = 0; i < usersBalance; i++) {
                uint256 ticketId = tokenOfOwnerByIndex(owner, i);
                Ticket storage ticketItem = tickets[ticketId];
                userTickets[i] = ticketItem;
            }
        }
        return userTickets;
    }
}
