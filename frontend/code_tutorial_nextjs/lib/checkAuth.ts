import useSWR from "swr";

// const fetcher = (...args: any) =>
//   fetch(args).then((res: any) => {
//       res.json()
//     // res.json().then((data: any) => {
//     //     console.log(data);
//     //     return data;
//     //   });
//   });

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useLoggedIn() {
  const { data, error } = useSWR("/api/token", fetcher);
  let authenticated = data;
  return { authenticated, error };
}
