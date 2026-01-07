import React from 'react';
import Header from '../../components/header/Header';
import Ranking from './components/ranking/Ranking';
import RandomHamburger from '../../components/randomHamburger/RandomHamburger';
function RankingPage() {
	return (
		<>
			<Header/>
			<section>
					<Ranking/>
			</section>
			<RandomHamburger/>
		</>
	);
}

export default RankingPage;