const prefix = '!';
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

var mineMsgId: string;
var mineSize: number;
var mineBombs: number;
var field: Array<string>;
var firstTime: boolean;
var theActualField: Array<string>;
var winCounter: number = 0;

cmd.raw({
  name: 'showfield',
  aliases: ['sf', 'field', 'show'],
  description: 'Shows the field',
  filters: USER_PERMS
}, async (msg) => {
  await msg?.reply((await generateField(10, 3, false, -1)).join(''));
});

cmd.on({
  name: 'minesweeper',
  aliases: ['ms', 'mine'],
  description: 'Starts a solo game of Minesweeper',
  filters: USER_PERMS
},

  (args) => ({
    fieldSize: args.numberOptional(),
    numberOfBombs: args.numberOptional()
  }),
  async (msg, { fieldSize, numberOfBombs }) => {
    if (!fieldSize) {
      fieldSize = 7;
    } else if (fieldSize > 14) {
      fieldSize = 14;
      await msg?.reply('Not over 14 rows!');
    } else if (fieldSize < 4) {
      fieldSize = 4;
      await msg?.reply('Not under 4 rows!');
    }

    if (!numberOfBombs) {
      numberOfBombs = 2;
    } else if (numberOfBombs < 1) {
      numberOfBombs = 1;
      await msg?.reply('At least 1 bomb!');
    } else if (numberOfBombs > fieldSize) {
      numberOfBombs = fieldSize;
      await msg?.reply('Too many bombs!');
    }

    let field: Array<string> = await generateField(
      fieldSize,
      numberOfBombs,
      true,
      -1
    );

    await msg?.reply(
      `*Minesweeper: fieldsize: ${fieldSize} + bombs: ${numberOfBombs}*\n` +
        field.join('')
    );
  }
);

cmd.on({
  name: 'minesweeperCoop',
  aliases: ['msc', 'coop'],
  description: 'Starts a Coop game of Minesweeper',
  filters: USER_PERMS
},
  (args) => ({
    fieldSize: args.numberOptional(),
    numberOfBombs: args.numberOptional()
  }),
  async (msg, { fieldSize, numberOfBombs }) => {
    if (!fieldSize) {
      fieldSize = 7;
    } else if (fieldSize > 14) {
      fieldSize = 14;
      await msg?.reply('Not over 14 rows!');
    } else if (fieldSize < 4) {
      fieldSize = 4;
      await msg?.reply('Not under 4 rows!');
    }

    if (!numberOfBombs) {
      numberOfBombs = 2;
    } else if (numberOfBombs < 1) {
      numberOfBombs = 1;
      await msg?.reply('At least 1 bomb!');
    } else if (numberOfBombs > fieldSize) {
      numberOfBombs = fieldSize;
      await msg?.reply('Too many bombs!');
    }

    field = new Array(fieldSize * fieldSize + (fieldSize - 1)).fill(
      '||:black_medium_small_square:||'
    );

    for (let i = 1; i < fieldSize; i++) {
      field[i * (fieldSize + 1) - 1] = '\n';
    }

    await msg
      ?.reply(
        `**Minesweeper**: fieldsize: ${fieldSize} + bombs: ${numberOfBombs}\n *Type ${prefix}op x y* to open a field \n` +
          field.join('')
      )
      .then(async (theMsg) => {
        mineMsgId = theMsg.id;
      });

    firstTime = true;
    mineBombs = numberOfBombs;
    mineSize = fieldSize;
  }
);

cmd.on({
  name: 'op',
  aliases: ['position', 'square'],
  description: 'select a square to uncover in a game of Minesweeper',
  filters: USER_PERMS
}.
  (args) => ({
    x: args.number(),
    y: args.number()
  }),
  async (msg, { x, y }) => {
    if (!mineMsgId) {
      return;
    }

    await msg?.delete();

    const theChannel = await discord.getGuildTextChannel(msg.channelId);
    const theOldMsg = await theChannel?.getMessage(mineMsgId);

    if (x > mineSize) {
      return setTimeout(async () => {
        await msg?.reply('x not over: ' + mineSize + '!');
      }, 15000);
    } else if (x < 1) {
      return setTimeout(async () => {
        await msg?.reply('x has to be at least 1!');
      }, 15000);
    }
    if (y > mineSize) {
      return setTimeout(async () => {
        await msg?.reply('y not over: ' + mineSize);
      }, 15000);
    } else if (y < 1) {
      return setTimeout(async () => {
        await msg?.reply('y has to be at least 1!');
      }, 15000);
    }

    let z = (y - 1) * (mineSize + 1) + (x - 1);

    if (firstTime) {
      theActualField = await generateField(mineSize, mineBombs, false, z);
      firstTime = false;
    }

    if (field[z] != theActualField[z]) {
      winCounter++;

      field[z] = theActualField[z];

      await theOldMsg?.edit(
        `**Minesweeper**: fieldsize: ${mineSize} + bombs: ${mineBombs}\n *Type ${prefix}op x y* to open a field \n` +
          field.join('')
      );

      if (field[z] == '💣') {
        firstTime = true;
        mineMsgId = '';
        mineSize = 0;
        mineBombs = 0;
        winCounter = 0;
        field = [];
        theActualField = [];
        return setTimeout(async () => {
          await theOldMsg?.delete();
          await msg?.reply(msg.member.toMention() + ' loses the game!');
        }, 15000);
      }

      if (theActualField.length - (mineSize - 1) - winCounter <= mineBombs) {
        firstTime = true;
        mineMsgId = '';
        mineSize = 0;
        mineBombs = 0;
        winCounter = 0;
        field = [];
        theActualField = [];
        return setTimeout(async () => {
          await theOldMsg?.delete();
          await msg?.reply(msg.member.toMention() + ' wins the game!');
        }, 15000);
      }
    }
  }
);

async function generateField(
  fieldSize: number,
  numberOfBombs: number,
  spoiler: boolean,
  firstField: number
) {
  let bombCoordinates: number;
  let coordinatesWithNotZeroOrBomb: Array<number> = [];
  let theActualNumber: Array<number> = [];
  let spoilers: string = '';

  if (spoiler) {
    spoilers = '||';
  }

  let possibleNumbers: Array<number> = [
    1,
    -1,
    fieldSize,
    fieldSize + 1,
    fieldSize + 2,
    -fieldSize,
    -(fieldSize + 1),
    -(fieldSize + 2)
  ];

  let field = new Array(fieldSize * fieldSize + (fieldSize - 1)).fill(
    spoilers + '0️⃣' + spoilers
  );

  for (let i = 1; i < fieldSize; i++) {
    field[i * (fieldSize + 1) - 1] = '\n';
  }

  for (let i = 0; i < numberOfBombs; i++) {
    bombCoordinates = Math.floor(Math.random() * Math.floor(field.length));
    if (
      field[bombCoordinates] == spoilers + '💣' + spoilers ||
      field[bombCoordinates] == '\n' ||
      bombCoordinates == firstField
    ) {
      i--;
    } else {
      field[bombCoordinates] = spoilers + '💣' + spoilers;

      for (var y = 0; y < possibleNumbers.length; y++) {
        if (
          field[bombCoordinates + possibleNumbers[y]] != '\n' &&
          field[bombCoordinates + possibleNumbers[y]] !=
            spoilers + '💣' + spoilers &&
          field[bombCoordinates + possibleNumbers[y]]
        ) {
          coordinatesWithNotZeroOrBomb.push(
            bombCoordinates + possibleNumbers[y]
          );
          theActualNumber[bombCoordinates + possibleNumbers[y]] =
            (theActualNumber[bombCoordinates + possibleNumbers[y]] ?? 0) + 1;
        }
      }
    }
  }

  coordinatesWithNotZeroOrBomb.forEach(async (theCoordinate) => {
    if (field[theCoordinate] != spoilers + '💣' + spoilers) {
      switch (theActualNumber[theCoordinate]) {
        case 1:
          field[theCoordinate] = spoilers + ':one:' + spoilers;
          break;
        case 2:
          field[theCoordinate] = spoilers + ':two:' + spoilers;
          break;
        case 3:
          field[theCoordinate] = spoilers + ':three:' + spoilers;
          break;
        case 4:
          field[theCoordinate] = spoilers + ':four:' + spoilers;
          break;
        case 5:
          field[theCoordinate] = spoilers + ':five:' + spoilers;
          break;
        case 6:
          field[theCoordinate] = spoilers + ':six:' + spoilers;
          break;
        case 7:
          field[theCoordinate] = spoilers + ':seven:' + spoilers;
          break;
        case 8:
          field[theCoordinate] = spoilers + ':eight:' + spoilers;
          break;
        case 9:
          field[theCoordinate] = spoilers + ':nine:' + spoilers;
          break;
        default:
          field[theCoordinate] = spoilers + '❗' + spoilers;
          break;
      }
    }
  });

  return field;
}
