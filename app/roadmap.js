/* The roadmap to the Platinum, built from the official trophy descriptions. */
export const ROADMAP_STAGES = [
  {
    title: 'Play the story — Chapters 1 to 4 and the finale',
    text: 'Finish Gone Fishing, then Chapters 1, 2, 3 and 4, the named missions (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory) and the final mission. That banks 12 story trophies plus the Gold for the finale, and opens both protagonists from Chapter 2.',
  },
  {
    title: 'Guard the one possibly-missable trophy in Chapter 1',
    text: 'Meditate at every spot across Leonida — 18 spots — and above all do Lucia\u2019s balcony meditation in Chapter 1 before that chapter ends. The launch guides flag Positive Mental Attitude as the only trophy that may be missable, and there is no mission replay. Keep a manual save at the start of every chapter.',
  },
  {
    title: 'Finish the side characters and stranger strands',
    text: 'Complete the final missions for Andy, Kenton, Billy, Randy and Tyrone, and complete 8 stranger mission strands in total for the Silver Strangers & Freaks. Each finished strand counts twice.',
  },
  {
    title: 'Collectibles and the map',
    text: 'Complete 3 Collectible Card sets (18 sets exist), WAiNK It at 100 locations, discover 100 vehicles, buy all 8 garage properties, register 10 vehicles to the Scooter Bros app, and explore all 52 areas of Leonida. Do cards, vehicles and WAiNK It as you travel — not in one last sweep.',
  },
  {
    title: 'Activities and the Shooting Range',
    text: 'Try all 9 activity types, win a Top Fun Drone Race at every one of the 14 locations, win 20 different races, beat Cal in a fishing challenge, finish an arcade game, bowl at the Kolt & Associates alley, hunt the unique animal for Bret, and earn gold in all 42 Shooting Range challenges.',
  },
  {
    title: 'Robberies, combat and money',
    text: 'Rob 5 bank vaults and escape, rob an armored truck, rob one illegal operation for each of the 9 gangs, rob a jewelry store undetected, take down 5 enemies in one Combat Focus, lose a 4-star wanted level with your partner, and rob 3 shops back-to-back with your partner. Launder $250,000 of Marked Bills and spend $100,000 across all shops along the way.',
  },
  {
    title: 'Cleanup and 100% completion',
    text: 'Complete 250 stunts (397 exist), complete 50 challenges, and work the 100% Completion Checklist that unlocks after the story — only 15 of the 18 card sets count toward it. The Gold A Long Road is usually the last trophy before the Platinum pops.',
  },
];

export function renderRoadmap(listElement) {
  listElement.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const item = document.createElement('li');
    const title = document.createElement('strong');
    title.textContent = stage.title;
    const text = document.createElement('p');
    text.textContent = stage.text;
    item.append(title, text);
    listElement.append(item);
  }
}
