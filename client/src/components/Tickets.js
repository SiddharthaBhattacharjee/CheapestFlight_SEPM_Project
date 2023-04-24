import ticketimg from '../images/Ticket.png';

const Tickets = (props) => {
    let name = props.name;
    let age = props.age;
    let date = props.date;
    let from = props.from;
    let to = props.to;

    return (
        <div style={{
            width: '65.5vh',
            height: '33vh',
            background: `url(${ticketimg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: '10px',
            paddingLeft: '23%',
            paddingRight: '18%',
            color: 'black',
            fontFamily: 'sans-serif',
        }}>
            <div>
                <p>Name: </p>
                <p>{name}</p>
            </div>
            <div>
                <p>Age: </p>
                <p>{age}</p>
            </div>
            <div>
                <p>Date: </p>
                <p>{date}</p>
            </div>
            <div>
                <p>From: </p>
                <p>{from}</p>
            </div>
            <div>
                <p>To: </p>
                <p>{to}</p>
            </div>
        </div>
    )
}

export default Tickets;