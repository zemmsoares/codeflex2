package pt.codeflex.evaluatesubmissions;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.Queue;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import net.schmizz.sshj.common.IOUtils;
import net.schmizz.sshj.connection.ConnectionException;
import net.schmizz.sshj.connection.channel.direct.Session;
import net.schmizz.sshj.connection.channel.direct.Session.Command;
import net.schmizz.sshj.transport.TransportException;
import net.schmizz.sshj.xfer.FileSystemFile;
import pt.codeflex.controllers.DatabaseController;
import pt.codeflex.databasemodels.Durations;
import pt.codeflex.databasemodels.Leaderboard;
import pt.codeflex.databasemodels.Problem;
import pt.codeflex.databasemodels.Result;
import pt.codeflex.databasemodels.Scoring;
import pt.codeflex.databasemodels.Submissions;
import pt.codeflex.databasemodels.TestCases;
import pt.codeflex.databasemodels.Tournament;
import pt.codeflex.models.Host;
import pt.codeflex.repositories.LeaderboardRepository;
import pt.codeflex.repositories.ResultRepository;
import pt.codeflex.repositories.ScoringRepository;
import pt.codeflex.repositories.SubmissionsRepository;
import pt.codeflex.utils.Path;

import static pt.codeflex.evaluatesubmissions.EvaluateConstants.PATH_SPRING;
import static pt.codeflex.evaluatesubmissions.EvaluateConstants.PATH_SERVER;
import static pt.codeflex.evaluatesubmissions.EvaluateConstants.CLASS_FILE_NAME;

@Component
@Transactional
@Scope("prototype")
public class EvaluateSubmissions implements Runnable {

	private static final Logger LOGGER = Logger.getLogger(EvaluateSubmissions.class.getName());

	@Autowired
	private DatabaseController db;

	@Autowired
	private ScoringRepository scoringRepository;

	@Autowired
	private SubmissionsRepository submissionsRepository;

	@Autowired
	private ResultRepository resultRepository;

	@Autowired
	private LeaderboardRepository leaderboardRepository;

	private Host host;
	private long uniqueId;
	private static Queue<Submissions> submissionsQueue = new ArrayDeque<Submissions>();

	@Override
	public void run() {

		LOGGER.log(Level.INFO, "Starting evaluation!");
		distributeSubmissions();
	}

	public synchronized void distributeSubmissions() {
		while (!submissionsQueue.isEmpty()) {
			Submissions submission = submissionsQueue.poll();
			compileSubmission(submission);

			if (compiledSuccessfully(submission)) {
				String executionOutput = executeTestCases(submission);
				evaluateExecutedTestCases(submission, executionOutput);
			}

		}
	}

	public List<Submissions> getSubmissions() {

		List<Submissions> submissions = submissionsRepository.findSubmissionsToAvaliate();
		List<Submissions> finalSubmissions = new ArrayList<>();

		for (Submissions s : submissions) {
			Optional<Submissions> submission = submissionsRepository.findById(s.getId());
			if (submission.isPresent() && !submissionsQueue.contains(submission.get())) {
				submissionsQueue.add(submission.get());
			}
		}

		return finalSubmissions;

	}

	public void compileSubmission(Submissions submission) {

		uniqueId = submission.getId();
		Session session = null;

		// TODO : fix when it doesn't connect. Should keep trying for a fixed amount of
		// time
		try {
			session = host.getSsh().startSession();
		} catch (ConnectionException | TransportException e2) {
			e2.printStackTrace();
		}

		CompilationInfo compilationInfo = CommandGeneration.compilation(submission);

		String command = compilationInfo.getCommand();
		String suffix = compilationInfo.getLanguageSuffix();

		Command cmd = null;
		try {
			String createFolderCommand = "mkdir " + PATH_SERVER + Path.separator + uniqueId + "_"
					+ submission.getLanguage().getName();
			cmd = session.exec(createFolderCommand);

			cmd.close();

		} catch (ConnectionException | TransportException e1) {
			e1.printStackTrace();
		}
		
		System.out.println("#############################");
		System.out.println(submission.getLanguage().getName());


		if((submission.getLanguage().getName()).equals("Haskell")){
			
			System.out.println("#############################");
			System.out.println("SUBMISSAO HASKELL");
			String encodedtest = "";


			List<TestCases> testCases = submission.getProblem().getTestCases();
			//System.out.println("AUSHUAHSUASHUAHUSHAHA "+testCases.get(0).getInput());
			System.out.println("AUSHUAHSUASHUAHUSHAHA2 "+testCases.get(0).getDescription());


			if(testCases.get(0).getDescription().equals("Int,Int")){
				System.out.println("ENTROU NO PRIMEIRO");
				System.out.println("TYPE: "+testCases.get(0).getDescription());
				// Problema 1 Números perfeitos
				String decoded = new String(Base64.getDecoder().decode(submission.getCode()));
				String haskell_imports = "\nimport System.Environment\nimport System.IO \nimport Data.List\n\n";
				String hask_main_method = "\n\nmain :: IO()\nmain = do";
				String s3 = "\nargs <- getArgs\ncontents <- readFile (head args)\nlet value = read contents::Int\nprint(problem value)\n";
				String hask_main_content = s3.replaceAll("(?m)^", "\t");
				String join = haskell_imports+decoded+hask_main_method+hask_main_content;
				encodedtest = new String(Base64.getEncoder().encode(join.getBytes()));
				
				createFile(new String(Base64.getDecoder().decode(encodedtest)), "Solution");
				
			}else if(testCases.get(0).getDescription().equals("Int,String")){
				System.out.println("ENTROU NO SEGUNDO");
				System.out.println("TYPE: "+testCases.get(0).getDescription());
				// Problema 3 – Dia de Natal
				String decoded = new String(Base64.getDecoder().decode(submission.getCode()));

				String haskell_imports = "\nimport System.Environment\nimport System.IO \nimport Data.List\n\n";
				String hask_main_method = "\n\nmain :: IO()\nmain = do";
				String s3 = "\nargs <- getArgs\ncontents <- readFile (head args)\nlet value = read contents::Int\nproblem(value)\n";
				String hask_main_content = s3.replaceAll("(?m)^", "\t");

				String join = haskell_imports+decoded+hask_main_method+hask_main_content;
				encodedtest = new String(Base64.getEncoder().encode(join.getBytes()));
				System.out.println(join);
			
				createFile(new String(Base64.getDecoder().decode(encodedtest)), "Solution");
				
			}else {
				System.out.println("TYPE: "+testCases.get(0).getDescription());
				String decoded = new String(Base64.getDecoder().decode(submission.getCode()));

				String haskell_imports = "\nimport System.Environment\nimport System.IO \nimport Data.List\n\n";
				String hask_main_method = "\n\nmain :: IO()\nmain = do";
				String s3 = "\nargs <- getArgs\ncontents <- readFile (head args)\nlet value = read contents::String\nprint(problem value)\n";
				String hask_main_content = s3.replaceAll("(?m)^", "\t");

				String join = haskell_imports+decoded+hask_main_method+hask_main_content;
				encodedtest = new String(Base64.getEncoder().encode(join.getBytes()));
				System.out.println(join);
			
				// Create file with the code and send it to the server
				//createFile(new String(Base64.getDecoder().decode(encodedtest)), "Solution");
				createFile(new String(Base64.getDecoder().decode(encodedtest)), "Solution");
			
			
			}



			
		}else if((submission.getLanguage().getName()).equals("Prolog")){
			System.out.println("#############################");
			System.out.println("SUBMISSAO PROLOG");
			System.out.println("#############################");
			String encodedtest = "";
			List<TestCases> testCases = submission.getProblem().getTestCases();

				System.out.println("TYPE: "+testCases.get(0).getInput());
				String decoded = new String(Base64.getDecoder().decode(submission.getCode()));

				String prolog_driver_header = ":-style_check(-singleton).\n\n";				
				String prolog_driver = "\nprint_status(F) :-\n    (F)	-> write('true')\n    ;(\\+F) -> write('false').\n\nmain :- \n    print_status("+testCases.get(0).getInput()+"),\n    halt.\n";

				String join = prolog_driver_header + decoded + prolog_driver;
				encodedtest = new String(Base64.getEncoder().encode(join.getBytes()));
				System.out.println(join);
			
				createFile(new String(Base64.getDecoder().decode(encodedtest)), "Solution");

			
		} else {
			System.out.println("#############################");
			System.out.println("SUBMISSAO JAVA");

			// Create file with the code and send it to the server
			//createFile(new String(Base64.getDecoder().decode(encodedtest)), "Solution");
			createFile(new String(Base64.getDecoder().decode(submission.getCode())), "Solution");
		}



		
		scp(PATH_SPRING + Path.separator + CLASS_FILE_NAME, PATH_SERVER + Path.separator + uniqueId + "_"
				+ submission.getLanguage().getName() + Path.separator + "Solution" + suffix);

		// Sends the command created previously to compile the code
		try {
			session = host.getSsh().startSession();
			cmd = session.exec(command);
			cmd.close();

		} catch (ConnectionException | TransportException e) {
			e.printStackTrace();
		}

	}



	public boolean compiledSuccessfully(Submissions submission) {
		Session session;
		try {
			session = host.getSsh().startSession();
			String compilerError = EvaluateConstants.COMPILER_ERROR;

			String command = "cat " + PATH_SERVER + Path.separator + uniqueId + "_" + submission.getLanguage().getName()
					+ Path.separator + compilerError;
			Command cmd = session.exec(command);
			String output = IOUtils.readFully(cmd.getInputStream()).toString();

			if (!output.equals("")) {
				List<Result> current = resultRepository.findAllByName("Compiler Error");

				boolean exists = false;
				for (Result r : current) {
					if (r.getMessage() != null && r.getMessage().equals(output)) {
						exists = true;
						submission.setResult(r);
					}
				}

				if (!exists) {
					Result r = new Result("Compiler Error", output);
					resultRepository.save(r);
					submission.setResult(r);
				}

				Scoring sc = new Scoring(submission, new TestCases(), 0, 0);
				scoringRepository.save(sc);

				submissionsRepository.save(submission);
				System.out.println("Compiler error!");
				return false;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		return true;
	}

	public String executeTestCases(Submissions submission) {
		List<TestCases> testCases = submission.getProblem().getTestCases();

		String commandsToExecute = "";
		String dirName = submission.getId() + "_" + submission.getLanguage().getName() + Path.separator;
		String obtainOutput = "(";

		for (TestCases tc : testCases) {

			System.out.println("Before creating file");
			System.out.println(tc.getInput() + ", "  + dirName + ", " + String.valueOf(tc.getId()));
			createFileInFolder(tc.getInput(), dirName, String.valueOf(tc.getId()));

			commandsToExecute += CommandGeneration.execution(submission, tc) + "\n";
			obtainOutput += " echo '%%%output_" + tc.getId() + "' && cat output_" + submission.getId() + "_"
					+ tc.getId() + ".txt && echo 'end%%%' &&";
		}

		scp(PATH_SPRING + Path.separator + dirName, PATH_SERVER + Path.separator + submission.getId() + "_"
				+ submission.getLanguage().getName() + Path.separator);

		// creates jobs to be executed by parallel
		createFile(commandsToExecute, "jobs.txt");
		scp(PATH_SPRING + Path.separator + "jobs.txt", PATH_SERVER + Path.separator + submission.getId() + "_"
				+ submission.getLanguage().getName() + Path.separator);

		// removes the last uneccessary &&
		if (obtainOutput.length() > 2) {
			obtainOutput = obtainOutput.substring(0, obtainOutput.length() - 2);
		}
		obtainOutput += " ) 2> err";

		String output = runTestCasesForSubmission(submission, obtainOutput);
		System.out.println("\n\n\n" + output + "\n\n\n");

		return output;

	}

	public void evaluateExecutedTestCases(Submissions submission, String testCasesOutput) {
		Problem problem = submission.getProblem();
		List<TestCases> testCases = problem.getTestCases();

		int totalTestCasesForProblem = problem.getTestCases().size();
		int givenTestCases = 0;

		// checks all testcases
		for (TestCases tc : testCases) {
			System.out.println("Input" + tc.getInput());
			String tcName = "%%%output_" + tc.getId();
			String s = testCasesOutput;
			if (!s.equals("")) {
				s = s.substring(s.indexOf(tcName));
				s = s.substring(0, s.indexOf("end%%%"));
				s = s.replace(tcName, "").trim();
			}

			// Evaluates test case
			int isRight = validateResult(tc.getOutput(), s);

			if (tc.isShown()) {
				//givenTestCases++;
			}

/*
			double score = isRight == 1
					? ((double) submission.getProblem().getMaxScore()
							/ ((double) totalTestCasesForProblem - (double) givenTestCases))
					: 0;

					

*/			System.out.println("SCOOOOOOOOOOOOOOORE:" + submission.getUsers().getUsername());
			System.out.println("SUBMISSIONS BY USER ID "+ db.getAllSubmissionsByUsernameAndProblemId(submission.getUsers().getUsername(),submission.getProblem().getId()).size());
			
			



			double score = isRight == 1
					? ((double) submission.getProblem().getMaxScore()
							/ ((double) totalTestCasesForProblem - (double) givenTestCases))
					: 0;

			System.out.println("teste : "+submission.getProblem());

			System.out.println("isRight" +isRight);
			System.out.println("submission.getProblem().getMaxScore()" +submission.getProblem().getMaxScore());
			System.out.println("totalTestCasesForProblem" +totalTestCasesForProblem);
			System.out.println("givenTestCases" +givenTestCases);

			System.out.println("-------------------------------------------------------------------");
			System.out.println(submission.getProblem().getMaxScore());

			LOGGER.log(Level.INFO, "Score: " + score);
			Scoring sc = new Scoring(submission, tc, score, isRight);
			scoringRepository.save(sc);

		}

		updateSubmissionDetailsAndLeaderboard(submission, totalTestCasesForProblem);
	}

	public void updateSubmissionDetailsAndLeaderboard(Submissions submission, int totalTestCasesForProblem) {

		List<Scoring> scoringBySubmission = scoringRepository.findAllBySubmissions(submission);
		int amountOfTestCasesScored = scoringBySubmission.size();
		int countCorrectScoring = 0;

		if (amountOfTestCasesScored == totalTestCasesForProblem) {
			double totalScore = 0;
			for (Scoring s : scoringBySubmission) {
				if (s.getIsRight() == 1) {
					countCorrectScoring++;
				}



				totalScore += s.getValue();

			
				
			
			
			}

			if (countCorrectScoring == totalTestCasesForProblem) {
				submission.setResult(resultRepository.findByName("Correct"));


int tries = db.getAllSubmissionsByUsernameAndProblemId(submission.getUsers().getUsername(),submission.getProblem().getId()).size();
			System.out.println(tries);

			for(int i=0; i<tries;i++){
				totalScore = totalScore -10;
			}

				// Updates the completion date in order to calculate how much time a user took
				// to solve the problem
				Durations currentDuration = db.viewDurationsById(submission.getUsers().getId(),
						submission.getProblem().getId());
				db.updateDurationsOnProblemCompletion(currentDuration);
			} else {
				submission.setResult(resultRepository.findByName("Incorrect"));
			}
			submission.setScore(totalScore);
			submissionsRepository.save(submission);

			List<Leaderboard> highestSubmissionOnLeaderboard = leaderboardRepository
					.findHighestScoreByUserByProblem(submission.getUsers(), submission.getProblem());

			Leaderboard newLeaderboard = new Leaderboard(totalScore, submission.getUsers(), submission.getProblem(),
					submission.getLanguage().getName());

			Tournament currentTournament = submission.getProblem().getTournament();

			// Do not change the leaderboard if the tournament is closed
			if (currentTournament != null && !currentTournament.getOpen()) {
				return;
			}

			if (!highestSubmissionOnLeaderboard.isEmpty()) {

				Leaderboard maxScoreSubmission = highestSubmissionOnLeaderboard.get(0);

				// ugly, can't figure out how to load an object using only the id from the
				// previous query
				Optional<Leaderboard> currentLeaderboard = leaderboardRepository.findById(maxScoreSubmission.getId());

				if (totalScore > maxScoreSubmission.getScore()) {
					if (maxScoreSubmission.getScore() == -1) {
						maxScoreSubmission = newLeaderboard;
					} else {
						if (currentLeaderboard.isPresent()) {
							maxScoreSubmission = currentLeaderboard.get();
							maxScoreSubmission.setScore(totalScore);
						}
					}
					leaderboardRepository.save(maxScoreSubmission);
				}
			} else {
				leaderboardRepository.save(newLeaderboard);
			}
		}
	}

	public String runTestCasesForSubmission(Submissions submission, String obtainOutput) {

		Session session = null;
		try {
			session = host.getSsh().startSession();
		} catch (ConnectionException | TransportException e) {

		}

		String dirName = submission.getId() + "_" + submission.getLanguage().getName();
		String command = " cd " + PATH_SERVER + Path.separator + dirName + " && parallel -j `nproc` < jobs.txt ; ";
		command = command.concat(obtainOutput);

		try {

			Command cmd = session.exec(command);
			String output = IOUtils.readFully(cmd.getInputStream()).toString();

			System.out.println("OUTPUT " + output);

			cmd.close();
			return output;
		} catch (IOException e) {
			e.printStackTrace();
		}

		return null;

	}

	private int validateResult(String tcOutput, String output) {
		System.out.println("Comparing results");
		System.out.println(tcOutput + " - " + output + "\n");

		if (tcOutput.trim().equals(output.trim())) {
			return 1;
		} else if (output.trim().equals("")) {
			return -1;
		}
		return 0;
	}

	public void createFile(String text, String file) {
		PrintWriter writer = null;
		try {
			writer = new PrintWriter(PATH_SPRING + Path.separator + file, "UTF-8");
			writer.print(text);
			writer.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			Logger.getLogger("Create File").log(Level.SEVERE, "Error creating file", e);
			e.printStackTrace();
		}
	}

	public void createFileInFolder(String text, String folder, String file) {
		PrintWriter writer = null;
		try {
			new File(PATH_SPRING + Path.separator + folder).mkdirs();
			writer = new PrintWriter(PATH_SPRING + Path.separator + folder + Path.separator + file, "UTF-8");
			writer.print(text);
			writer.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			Logger.getLogger("Create File").log(Level.SEVERE, "Error creating file", e);
			e.printStackTrace();
		}
	}

	public void scp(String src, String dest) {

		int count = 0;
		int maxCount = 5;
		while (count < maxCount) {
			try {
				System.out.println("Sending file from : " + src + " to " + dest + "\n\n");
				host.getSsh().newSCPFileTransfer().upload(new FileSystemFile(src), dest);
				break;
			} catch (IOException e) {
				e.printStackTrace();
				count++;
				System.out.println("Trying SCP for the " + count + " time. ");
			}
		}
	}

	public void setHost(Host host) {
		this.host = host;
	}
}
