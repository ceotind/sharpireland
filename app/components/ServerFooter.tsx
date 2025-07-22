import { getAllIndustries } from '@/app/utils/content-loader';
import { getRandomElements } from '@/app/utils/random-utils';
import Footer from './Footer';

export default async function ServerFooter() {
  const allIndustries = await getAllIndustries();
  const randomIndustries = getRandomElements(allIndustries, 4);

  return <Footer randomIndustries={randomIndustries} />;
}