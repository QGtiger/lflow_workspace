import { NavigateOptions, useNavigate } from 'react-router-dom';

export default function useNav() {
  const nav = useNavigate();

  return {
    nav,
    navEntry: () => nav('/console/manage'),
    navChatBotDetail: (id: string | number) => nav(`/console/manage/${id}`),
    navChatBotRecord: (id: string | number, name: string) => nav(`/console/chathistory?id=${id}&name=${name}`),
    navByDelSearchParam(key: string, navOptions?: NavigateOptions) {
      const search = new URLSearchParams(location.search);
      search.delete(key);
      nav(`${location.pathname}?${search.toString()}`, navOptions);
    },
  };
}
