import { useRouter } from "next/router";
import Image from "next/image";
import Router from "next/router";
import styled from "styled-components";

const Coins = ({ coins, currentPage }) => {
  const router = useRouter();
  return (
    <Viewport>
      <Container>
        {coins.map((coin) => (
          <Card key={coin.id} href={router.pathname + "coins/" + coin.id}>
            <Image src={coin.image} alt={coin.id} width={50} height={50} />
            <Name>
              {coin.name}
              <span>({coin.symbol})</span>
            </Name>

            <Price>
              <span>Price: </span>
              {coin.current_price}$
            </Price>
            <Percentage num={coin.price_change_percentage_24h}>
              <span>24h %: </span>
              {coin.price_change_percentage_24h}%
            </Percentage>
            <Price>
              <span>24h High: </span>
              {coin.high_24h}$
            </Price>
            <Price>
              <span>24h Low: </span>
              {coin.low_24h}$
            </Price>
          </Card>
        ))}
      </Container>
      <Navigation>
        <Button
          onClick={() => Router.push(`/?page=${currentPage - 1}`)}
          disabled={currentPage == 1}
        >
          ◀️
        </Button>
        <Numbers>
          <button onClick={() => Router.push(`/?page=${currentPage - 2}`)} className={`${currentPage - 2 <= 0 ? "hide" : "show"}`}>{currentPage - 2}</button>
          <button onClick={() => Router.push(`/?page=${currentPage - 1}`)} className={`${currentPage - 1 == 0 ? "hide" : "show"}`}>{currentPage - 1}</button>
          <button disabled className="currentPage" >{currentPage}</button>
          <button onClick={() => Router.push(`/?page=${currentPage + 1}`)}>{currentPage + 1}</button>
          <button onClick={() => Router.push(`/?page=${currentPage + 2}`)}>{currentPage + 2}</button>
          <button onClick={() => Router.push(`/?page=${currentPage + 3}`)}>{currentPage + 3}</button>
        </Numbers>

        <Button onClick={() => Router.push(`/?page=${currentPage + 1}`)}>
          ▶️
        </Button>
      </Navigation>
    </Viewport>
  );
};

export async function getServerSideProps(context) {
  if (context.query.page === undefined) {
    context.query.page = 1;
  }

  const req = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=${context.query.page}&sparkline=false&price_change_percentage=24h%2C7d%2C14d%2C30d%2C60d%2C200d%2C1y`
  );
  let data = await req.json();
  data = data.map((data) => {
    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      image: data.image,
      current_price: data.current_price,
      high_24h: data.high_24h,
      low_24h: data.low_24h,
      price_change_percentage_24h: data.price_change_percentage_24h,
    };
  });
  return {
    props: { coins: data, currentPage: parseInt(context.query.page) },
  };
}

const Viewport = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 50px 0px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3%;
  margin-bottom: 50px;
  align-items: center;
  flex-wrap: wrap;
`;

const Card = styled.a`
  height: 400px;
  width: 200px;
  border: 1px solid lightgrey;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10px;
`;
const Name = styled.div`
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 40px;
  padding-top: 20px;
  text-align: center;
  span {
    font-size: 10px;
    font-weight: 100;
    text-transform: uppercase;
    vertical-align: text-top;
    padding-left: 5px;
  }
`;

const Price = styled.div`
  font-size: 16px;
  padding-bottom: 10px;
  span {
    font-size: 14px;
    color: lightgrey;
  }
`;
const Percentage = styled.div`
  font-size: 16px;
  color: ${(props) => (props.num > 0 ? "green" : "red")};
  padding-bottom: 10px;
  span {
    font-size: 14px;
    color: lightgrey;
  }
`;
const Down = styled.div`
  font-size: 16px;
  color: red;
  padding-bottom: 10px;
  span {
    font-size: 14px;
    color: lightgrey;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 10px;
  background-color: white;
  border: 1px solid lightgray;
  cursor: pointer;
  &:hover {
    background-color: lightgray;
  }
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const Numbers = styled.div`
  margin: 0px 10px;
  button {
    margin-right: 10px;
    color: black;
    border: none;
    cursor: pointer;
    background-color: unset;
  }
  button.hide {
    display: none;
  }
  button.show {
    display: inline-block;
  }
  button.currentPage {
    color: gray;
    cursor: not-allowed;
  }
  button:last-child {
    margin-right: 0
  }
`
export default Coins;
