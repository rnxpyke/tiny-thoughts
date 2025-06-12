# Writing a Gameboy emulator

Recently, a friend of mine started to write a Gameboy Emulator to learn Rust.
Then I promptly nerd sniped myself from looking at his code to implementing a version myself.

I know that you, dear reader, also have this tingling feeling in your fingers.
"Hm, a gameboy doesn't sound too complicated", you say to yourself.
"This could be a nice little weekend project".

(Spoiler: It won't stay at a single weekend)

But to get from just considering to actually starting, you need some starting point.
A reference documentation, so to speak.

Fortunately, there are a lot of references and reseach in the Gameboy Emulator comunity.
There's [pandocs](https://gbdev.io/pandocs/) great documentation for general stuff,
and [gekkio's technical reference](https://gekkio.fi/files/gb-docs/gbctr.pdf) pdf for specific instruction cycle timing.

Speaking of instruction timing, the Gameboy has two clocks.
One running on 4Mhz "T-cycles" and the other on 1Mhz "M-cycles".
In almost all cases, a Cpu M-cycle has exactly 4 T-cycles.

So you'd have to decide if you want to have an instruction, M-cycle, or T-cycle accurate emulator. 
Most emulator writers seem to be going for a mixed approach, were they advance the cpu by one instruction,
and all other components by the amount of cycles the cpu took for that instruction.

Differences in timing arise because the Gameboy has a mixed 8- and 16-bit architecture.
All addresses are 16 bits wide, were as the usual memory word is just 8 bits, with the ability to do 16 bit load and stores on register pairs.
Therefore, most instructions are only a single byte, in case of immediate arguments maybe two or even three bytes.
Instructions may take longer than one M-cycle because the cpu can only do a one-byte memory read/write per cycle.
This means that the instruction fetch itself takes at least one cycle, and instructions with immediates or load/store instruction take a bit longer.

If you choose to implement a cycle accurate emulator, you have to be careful with interleaved execution:
To fully utilize the available 1byte * 1Mhz memory bandwidth,
the cpu interleaves fetching the next instruction with the computation of the current instruction.

The instruction set itself is similar to a Z80 and relatively simple.
There's a simple set of accumulator-based ALU instructions.
Any add or subtract is always of the form A = A op R where R is another register,
or the value in memory that the combined HL address register points to.
Conditional instructions utilize the flags register F, which is populated by most arithmetic instructions. 
Relative jumps can reach from -128 to 127 bytes from the current address,
and calls can encode a full 16 bit absolute address to jump to.

To test if your cpu emulator is (M-cycle) accurate, you can use the [sm83 Single Step](https://github.com/SingleStepTests/sm83/) test-suite.
It contains 1000 test cases for each valid instruction of the Gameboy sm83 core. 


After finishing your CPU core emulator, you need to implement memory banking and memory mapped registers.
There's a few special locations in the address space.
at 0x0000 to 0x0100 is the Boot ROM, which checks the ROMs Validity, then disables itself,
by setting a special memory mapped register, so the accesses at the early boot rom addresses are routed
to the ROM instead.

Then there's a few special memory bank registers, which can swap out huge ranges in address space to
other physical memory cells in the game cartridge.
(This is the mechanism that allowed multi-game cartridges, for example.)

The memory mapped registers at 0xFF00 and above also contain stuff like the state of the buttons and d-pad,
which are essential for actually interacting with the game.

Finally, we need some output.
For that, the Gameboy has the Picture Processing Unit (PPU), and some audio chip I haven't looked at yet.
But you don't want to miss that iconic startup sound, do you?
