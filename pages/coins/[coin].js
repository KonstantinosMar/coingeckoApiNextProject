import { useRouter } from "next/router";
import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";

export default function Coin({ coin }) {
  const router = useRouter();
  return (
    <div>
      <Back onClick={() => router.back()}>Back</Back>

      <TopRow>
        <Logo>
          <Image src={coin.image} alt={coin.id} width={50} height={50} />
          <Name>
            {coin.name}
            <span>({coin.symbol})</span>
          </Name>
        </Logo>

        <Price>{coin.current_price}$</Price>
      </TopRow>

      <TableContainer>
        <PercentageRow>
          <thead>
            <tr>
              <th>High 24h</th>
              <th>Low 24h</th>
              <th>24h %</th>
              <th>7d %</th>
              <th>14d %</th>
              <th>30d %</th>
              <th>60d %</th>
              <th>200d %</th>
              <th>1y %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{coin.high_24h}$</td>
              <td>{coin.low_24h}$</td>
              <Percentage num={coin.price_change_percentage_24h}>
                {coin.price_change_percentage_24h}%
              </Percentage>
              <Percentage num={coin.price_change_percentage_7d}>
                {coin.price_change_percentage_7d}%
              </Percentage>
              <Percentage num={coin.price_change_percentage_14d}>
                {coin.price_change_percentage_14d}%
              </Percentage>
              <Percentage num={coin.price_change_percentage_30d}>
                {coin.price_change_percentage_30d}%
              </Percentage>
              <Percentage num={coin.price_change_percentage_60d}>
                {coin.price_change_percentage_60d}%
              </Percentage>
              <Percentage num={coin.price_change_percentage_200d}>
                {coin.price_change_percentage_200d}%
              </Percentage>
              <Percentage num={coin.price_change_percentage_1y}>
                {coin.price_change_percentage_1y}%
              </Percentage>
            </tr>
          </tbody>
        </PercentageRow>
      </TableContainer>

      <Description dangerouslySetInnerHTML={{ __html: coin.description }}></Description>
    </div>
  );
}

export async function getServerSideProps(context) {
  const req = await fetch(
    `https://api.coingecko.com/api/v3/coins/${context.query.coin}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
  let data = await req.json();

  data = {
    name: data.name,
    symbol: data.symbol,
    image: data.image.large,
    current_price: data.market_data.current_price.usd,
    description: data.description.en,
    price_change_percentage_24h: data.market_data.price_change_percentage_24h,
    price_change_percentage_7d: data.market_data.price_change_percentage_7d,
    price_change_percentage_14d: data.market_data.price_change_percentage_14d,
    price_change_percentage_30d: data.market_data.price_change_percentage_30d,
    price_change_percentage_60d: data.market_data.price_change_percentage_60d,
    price_change_percentage_200d: data.market_data.price_change_percentage_200d,
    price_change_percentage_1y: data.market_data.price_change_percentage_1y,
    high_24h: data.market_data.high_24h.usd,
    low_24h: data.market_data.low_24h.usd,
  };

  return {
    props: {
      coin: data,
    },
  };
}

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 800px;
  margin: 30px auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-left: 10px;
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
  padding: 10px;
  background-color: lightgray;
  border: 1px solid black;
`;

const Back = styled.div`
  cursor: pointer;
  margin: 30px 0px 0px 30px;
  text-decoration: underline;
  font-size: 18px;
  &::before {
    content: "< ";
  }
`;

const PercentageRow = styled.table`
  margin: 50px auto 30px auto;
  th {
    border-left: 1px solid lightgray;
    padding: 10px 20px;
    text-align: center;
    margin: 0;
  }
  td {
    padding: 10px 20px;
    text-align: center;
  }
  th:first-child {
    border-left: none;
  }
`;

const Percentage = styled.td`
  padding: 10px 20px;
  text-align: center;
  color: ${(props) => (parseInt(props.num) > 0 ? "green" : "red")};
`;

const TableContainer = styled.div`
  overflow-x: auto;
`
const Description = styled.div`
  max-width: 800px;
  margin: 30px auto;
  text-align: center;
  a {
    text-decoration: underline;
  }
`