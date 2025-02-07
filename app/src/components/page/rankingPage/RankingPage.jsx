import React from 'react';
import Header from '../../organisms/header/Header';
import Ranking from '../../organisms/ranking/Ranking';
import RandomHamburger from '../../organisms/randomHamburger/RandomHamburger';
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