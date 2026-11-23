/* 17-0 Game: draft 9 position groups, then simulate a 17-game season. */
(() => {
  const SPREAD = 2.6; // lower = favorites win more often (easier 17-0); higher = more upsets

  // key, label, weight in team rating
  const POS = [
    ['qb', 'Quarterback', 2], ['rb', 'Running back', 1], ['wr', 'Wide receiver', 1.2],
    ['te', 'Tight end', 0.6], ['ol', 'Offensive line', 1.2], ['dl', 'Defensive line', 1.4],
    ['lb', 'Linebacker', 0.9], ['cb', 'Cornerback', 1], ['s', 'Safety', 0.7]
  ];

  // name, team, season, rating
  const PLAYERS = {
    qb: [['Tom Brady', 'NE', 2007, 99], ['Peyton Manning', 'DEN', 2013, 98], ['Joe Montana', 'SF', 1989, 97], ['Dan Marino', 'MIA', 1984, 96], ['Kurt Warner', 'STL', 1999, 94], ['Johnny Unitas', 'BAL', 1964, 93]],
    rb: [['Jim Brown', 'CLE', 1963, 98], ['Barry Sanders', 'DET', 1997, 97], ['Adrian Peterson', 'MIN', 2012, 97], ['Emmitt Smith', 'DAL', 1995, 96], ['Walter Payton', 'CHI', 1977, 96], ['Marshall Faulk', 'STL', 1999, 95]],
    wr: [['Jerry Rice', 'SF', 1995, 99], ['Randy Moss', 'NE', 2007, 98], ['Calvin Johnson', 'DET', 2012, 97], ['Justin Jefferson', 'MIN', 2022, 96], ['Larry Fitzgerald', 'ARI', 2008, 95], ['Terrell Owens', 'PHI', 2004, 94]],
    te: [['Rob Gronkowski', 'NE', 2011, 97], ['Travis Kelce', 'KC', 2022, 96], ['Tony Gonzalez', 'KC', 2004, 94], ['Kellen Winslow', 'SD', 1981, 93], ['Shannon Sharpe', 'DEN', 1996, 92], ['Mike Ditka', 'CHI', 1963, 88]],
    ol: [['Anthony Munoz', 'CIN', 1988, 98], ['Jonathan Ogden', 'BAL', 2000, 97], ['Orlando Pace', 'STL', 2000, 96], ['Larry Allen', 'DAL', 1998, 96], ['Joe Thomas', 'CLE', 2010, 95], ['Zack Martin', 'DAL', 2016, 94]],
    dl: [['Aaron Donald', 'LAR', 2018, 99], ['Reggie White', 'PHI', 1987, 98], ['J.J. Watt', 'HOU', 2012, 98], ['Deacon Jones', 'LAR', 1967, 96], ['Bruce Smith', 'BUF', 1990, 95], ['Michael Strahan', 'NYG', 2001, 94]],
    lb: [['Lawrence Taylor', 'NYG', 1986, 99], ['Ray Lewis', 'BAL', 2000, 97], ['Dick Butkus', 'CHI', 1969, 96], ['Von Miller', 'DEN', 2015, 95], ['Derrick Thomas', 'KC', 1990, 94], ['Brian Urlacher', 'CHI', 2005, 93]],
    cb: [['Darrelle Revis', 'NYJ', 2009, 98], ['Deion Sanders', 'DAL', 1994, 97], ['Champ Bailey', 'DEN', 2006, 95], ['Rod Woodson', 'PIT', 1993, 94], ['Nnamdi Asomugha', 'OAK', 2010, 93], ['Jalen Ramsey', 'LAR', 2019, 90]],
    s: [['Ed Reed', 'BAL', 2008, 97], ['Ronnie Lott', 'SF', 1989, 96], ['Troy Polamalu', 'PIT', 2010, 96], ['Brian Dawkins', 'PHI', 2004, 94], ['Kenny Easley', 'SEA', 1984, 93], ['Steve Atwater', 'DEN', 1991, 92]]
  };

  // opponents: team-season, strength
  const OPP = [['1972 Dolphins', 98], ['1985 Bears', 97], ['2007 Patriots', 97], ['1984 49ers', 96], ['1989 49ers', 96], ['1978 Steelers', 95], ['1991 Redskins', 95], ['1996 Packers', 94], ['1992 Cowboys', 94], ['2001 Rams', 94], ['2011 Packers', 94], ['2013 Seahawks', 93], ['2015 Panthers', 93], ['1999 Rams', 93], ['1998 Broncos', 93], ['2019 Ravens', 92], ['2018 Chiefs', 92], ['2022 Eagles', 92], ['2009 Saints', 92], ['2004 Eagles', 91], ['1977 Cowboys', 90], ['2010 Steelers', 90], ['1993 Bills', 90], ['1968 Jets', 88], ['2012 Ravens', 88], ['1980 Raiders', 87], ['2000 Giants', 86], ['2017 Jaguars', 85], ['1995 Chargers', 85], ['2008 Cardinals', 84]];

  const root = document.getElementById('game');
  if (!root) return;
  let picks = [], round = 0;

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const shuffle = a => [...a].sort(() => Math.random() - 0.5);
  const img = (src, alt, size) => {
    const i = new Image(size, size);
    i.src = src; i.alt = alt; i.decoding = 'async';
    return i;
  };

  function layout(main) {
    const grid = el('div', 'game-grid');
    const side = el('aside', 'roster');
    side.setAttribute('aria-label', 'Your roster');
    side.append(el('h3', '', 'Your roster'));
    const ol = el('ol');
    POS.forEach(([k, label], i) => {
      const li = el('li', picks[i] ? 'filled' : '');
      li.append(img(`/images/pos-${k}.webp`, '', 32));
      const p = picks[i];
      li.append(el('span', '', p ? `${p.p[0]} (${p.p[3]})` : label));
      ol.append(li);
    });
    side.append(ol);
    grid.append(main, side);
    root.replaceChildren(grid);
  }

  function intro() {
    const main = el('div', 'panel');
    main.append(el('h3', '', 'Ready to draft?'));
    main.append(el('p', '', 'You get 9 picks, one for each position group. Every pick offers three players from random teams and eras. Choose well: a 17-0 season leaves no room for a weak spot.'));
    const b = el('button', 'btn', 'Start draft');
    b.type = 'button';
    b.addEventListener('click', () => { picks = []; round = 0; draft(); });
    main.append(b);
    layout(main);
  }

  function draft() {
    if (round >= POS.length) return ready();
    const [k, label] = POS[round];
    const main = el('div', 'panel');
    const prog = el('progress');
    prog.max = POS.length; prog.value = round;
    prog.setAttribute('aria-label', 'Draft progress');
    const h = el('h3', '', `Pick ${round + 1} of ${POS.length}: ${label}`);
    h.tabIndex = -1;
    const cards = el('div', 'cards');
    shuffle(PLAYERS[k]).slice(0, 3).forEach(p => {
      const c = el('button', 'card');
      c.type = 'button';
      const info = el('span', 'info');
      info.append(el('strong', '', p[0]), el('small', '', `${p[1]} ${p[2]} (${Math.floor(p[2] / 10) * 10}s)`));
      c.append(img(`/images/pos-${k}.webp`, label, 56), info, el('span', 'ovr', p[3]));
      c.addEventListener('click', () => { picks.push({ k, p }); round++; draft(); root.querySelector('h3').focus(); });
      cards.append(c);
    });
    main.append(prog, h, cards);
    layout(main);
  }

  function rating() {
    let sum = 0, w = 0;
    POS.forEach(([, , wt], i) => { sum += picks[i].p[3] * wt; w += wt; });
    return sum / w;
  }

  function ready() {
    const t = rating();
    const main = el('div', 'panel');
    const h = el('h3', '', 'Roster complete');
    h.tabIndex = -1;
    main.append(h, el('p', 'big', `Team rating: ${t.toFixed(1)}`));
    main.append(el('p', '', 'Your 17 opponents are random great, good and middling team-seasons from NFL history.'));
    const b = el('button', 'btn', 'Simulate 17 games');
    b.type = 'button';
    b.addEventListener('click', () => season(t));
    main.append(b);
    layout(main);
    h.focus();
  }

  function season(t) {
    const games = shuffle(OPP).slice(0, 17).map(([name, o]) => {
      const win = Math.random() < 1 / (1 + Math.exp(-(t - o) / SPREAD));
      const hi = 20 + Math.floor(Math.random() * 26), lo = 3 + Math.floor(Math.random() * Math.min(hi - 3, 21));
      return { name, win, score: win ? `${hi}-${lo}` : `${lo}-${hi}` };
    });
    const w = games.filter(g => g.win).length;
    const main = el('div', 'panel');
    const h = el('h3', '', `Final record: ${w}-${17 - w}`);
    h.tabIndex = -1;
    const verdict = w === 17 ? 'Perfect season. You built a 17-0 roster.'
      : w >= 15 ? 'So close. One bad Sunday kept you from perfection.'
      : w >= 12 ? 'A playoff team, but not an undefeated one.'
      : 'Back to the draft room. Prioritise quarterback and the lines.';
    main.append(h, el('p', 'big', verdict));
    const ul = el('ul', 'games');
    games.forEach((g, i) => {
      const li = el('li', g.win ? 'win' : 'loss');
      li.append(img(`/images/${g.win ? 'w' : 'l'}.webp`, g.win ? 'Win' : 'Loss', 28), el('span', '', `Week ${i + 1}: vs ${g.name}`), el('b', '', g.score));
      ul.append(li);
    });
    const again = el('button', 'btn', 'Draft again');
    again.type = 'button';
    again.addEventListener('click', () => { picks = []; round = 0; draft(); root.querySelector('h3').focus(); });
    main.append(ul, again);
    layout(main);
    h.focus();
  }

  intro();
})();
