import { getClient } from "../lib/apollo-client";
import { gql } from "@apollo/client";

const CountriesQuery = gql`
  query GetCountries {
    countries {
      name
      code
    }
  }
`;


export default async function Home() {
  const { data } = await getClient().query({
    query: CountriesQuery,
    context: {
      fetchOptions: {
        next: { revlidte: 10 },
      },
    },
  });

  return (
    <main className="">
      {data?.countries?.map((country: any, index: number) => {
        return (
          <div key={index} className="border-white border-b-2">
            <ul>
              <li>{country?.name}</li>
              <li>{country?.code}</li>
            </ul>
          </div>
        );
      })}
    </main>
  );
}