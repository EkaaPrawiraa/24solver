import React, { useState } from "react";
import {
	TextField,
	Button,
	Card,
	CardContent,
	Typography,
	Container,
	Grid,
} from "@mui/material";
import bgImage from "./assets/Photo.jpg";

const operators = ["+", "-", "*", "/"];

const generatePermutations = (nums) => {
	if (nums.length === 1) return [nums];

	const permutations = [];
	nums.forEach((num, index) => {
		const remaining = [...nums.slice(0, index), ...nums.slice(index + 1)];
		const remainingPerms = generatePermutations(remaining);
		remainingPerms.forEach((perm) => {
			permutations.push([num, ...perm]);
		});
	});
	return permutations;
};

const generateOperations = () => {
	const operations = [];
	operators.forEach((op1) => {
		operators.forEach((op2) => {
			operators.forEach((op3) => {
				operations.push([op1, op2, op3]);
			});
		});
	});
	return operations;
};

const evalOp = (a, op, b) => {
	switch (op) {
		case "+":
			return a + b;
		case "-":
			return a - b;
		case "*":
			return a * b;
		case "/":
			return b !== 0 ? a / b : NaN;
		default:
			return NaN;
	}
};

const evalExpression = (a, op1, b, op2, c, op3, d) => {
	return evalOp(evalOp(evalOp(a, op1, b), op2, c), op3, d);
};

const evalPartial = (a, op1, b, op2, c) => {
	return evalOp(evalOp(a, op1, b), op2, c);
};

const findSolutions = (cards) => {
	const solutions = new Set();
	const permutations = generatePermutations(cards);
	const operations = generateOperations();

	permutations.forEach((perm) => {
		operations.forEach((ops) => {
			const fullExpr = evalExpression(
				perm[0],
				ops[0],
				perm[1],
				ops[1],
				perm[2],
				ops[2],
				perm[3]
			);
			if (fullExpr === 24) {
				solutions.add(
					`(((${perm[0]} ${ops[0]} ${perm[1]}) ${ops[1]} ${perm[2]}) ${ops[2]} ${perm[3]})`
				);
			}
			const partial1 = evalPartial(perm[0], ops[0], perm[1], ops[1], perm[2]);
			const partial2 = evalPartial(perm[1], ops[1], perm[2], ops[2], perm[3]);

			if (evalPartial(partial1, ops[2], perm[3]) === 24) {
				solutions.add(
					`(((${perm[0]} ${ops[0]} ${perm[1]}) ${ops[1]} ${perm[2]}) ${ops[2]} ${perm[3]})`
				);
			}
			if (evalPartial(perm[0], ops[0], partial2) === 24) {
				solutions.add(
					`(${perm[0]} ${ops[0]} (${perm[1]} ${ops[1]} (${perm[2]} ${ops[2]} ${perm[3]})))`
				);
			}
		});
	});

	// console.log(solutions)
	return Array.from(solutions);
};

function App() {
	const [numbers, setNumbers] = useState([1, 1, 1, 1]);
	const [solutions, setSolutions] = useState([]);

	const handleInputChange = (index, value) => {
		const newNumbers = [...numbers];
		newNumbers[index] = parseInt(value, 10);
		setNumbers(newNumbers);
	};

	const handleSubmit = () => {
		const solutions = findSolutions(numbers);
		setSolutions(solutions);
	};

	return (
		<Container
			sx={{
        
				padding: 2,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				minWidth: "fit-content",
				maxWidth: "fit-content",
				margin: "0 auto",
				backgroundColor: "#fdf4e3",
				borderRadius: 2,
				border: "10px solid #ffff",
				backdropFilter: "blur(10px)",
				boxShadow: 3,
				position: "relative",
				fontFamily: "'Handjet', sans-serif",
			}}
		>
			<Typography variant="h1" sx={{ fontFamily: "'Handjet', sans-serif" }}>
				<b>24 Solver</b>
			</Typography>
			<Typography
				variant="body1"
				color="grey"
				gutterBottom
				sx={{ fontFamily: "'Handjet', sans-serif" }}
			>
				by ekaaPrawira
			</Typography>
			<div style={{ marginBottom: "20px" }}>
				{numbers.map((num, index) => (
					<TextField
						key={index}
						type="number"
						label={`Card ${index + 1}`}
						value={num}
						onChange={(e) => handleInputChange(index, e.target.value)}
						style={{ marginRight: "10px" }}
						variant="outlined"
						inputProps={{ min: 1, max: 11, step: 1 }}
					/>
				))}
			</div>
			<Button
				variant="contained"
				color="primary"
				onClick={handleSubmit}
				sx={{
					fontFamily: "'Handjet', sans-serif",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "black",
					borderRadius: "1rem",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
					"&:hover": {
						backgroundColor: "grey",
					},
				}}
			>
				Find Solutions
			</Button>
			<div style={{ marginTop: "20px", width: "100%" }}>
				<Typography
					variant="h2"
					gutterBottom
					sx={{ fontFamily: "'Handjet', sans-serif" }}
				>
					Solutions:
				</Typography>
				<Grid container spacing={2}>
					{solutions.length > 0 ? (
						solutions.map((solution, index) => (
							<Grid item xs={12} sm={6} md={4} key={index}>
								<Card
									sx={{
										borderRadius: "12px",
										boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
										transition: "transform 0.3s ease-in-out",
										"&:hover": {
											transform: "scale(1.03)",
										},
									}}
								>
									<CardContent
										sx={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Typography sx={{ fontFamily: "'Handjet', sans-serif" }}>
											{solution}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))
					) : (
						<Typography sx={{ fontFamily: "'Handjet', sans-serif" }}>
							No solution found.
						</Typography>
					)}
				</Grid>
			</div>
		</Container>
	);
}

export default App;
