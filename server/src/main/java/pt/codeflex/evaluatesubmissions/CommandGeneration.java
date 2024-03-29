package pt.codeflex.evaluatesubmissions;

import java.io.File;
import java.util.logging.Level;
import java.util.logging.Logger;

import pt.codeflex.databasemodels.Submissions;
import pt.codeflex.databasemodels.TestCases;
import pt.codeflex.utils.Path;

import static pt.codeflex.evaluatesubmissions.EvaluateConstants.CLASS_FILE_NAME;
import static pt.codeflex.evaluatesubmissions.EvaluateConstants.PATH_FIREJAIL;
import static pt.codeflex.evaluatesubmissions.EvaluateConstants.PATH_SERVER;
import static pt.codeflex.evaluatesubmissions.EvaluateConstants.RUN_ERROR;
import static pt.codeflex.evaluatesubmissions.EvaluateConstants.COMPILER_ERROR;

import java.util.List;

public class CommandGeneration {

	public static final Logger LOGGER = Logger.getLogger(CommandGeneration.class.getName());

	public static CompilationInfo compilation(Submissions submission) {

		long uniqueId = submission.getId();
		String command = "cd " + PATH_SERVER + Path.separator + uniqueId + "_" + submission.getLanguage().getName()
				+ " && ";
		String suffix = "";
		String compilerError = COMPILER_ERROR;

		switch (submission.getLanguage().getCompilerName()) {
		case "Java 8":
			command += "javac " + CLASS_FILE_NAME + ".java 2> " + compilerError;
			suffix = ".java";
			break;
		case "C++11 (gcc 5.4.0)":
			command += "g++ -std=c++11 -o " + CLASS_FILE_NAME + "_exec_" + uniqueId + " " + CLASS_FILE_NAME + ".cpp 2> "
					+ compilerError;
			suffix = ".cpp";
			break;
		case "Python 2.7":
			// TODO : get a compiler for python
			break;
		case "C# (mono 4.2.1)":
			command += "mcs -out:" + CLASS_FILE_NAME + "_exec_" + uniqueId + " " + CLASS_FILE_NAME + ".cs 2> "
					+ compilerError;
			suffix = ".cs";
			break;
		case "Prolog":
			command += "swipl --goal=main --stand_alone=true -q -o "+CLASS_FILE_NAME+" -c "+ CLASS_FILE_NAME +".pl 2> " + compilerError;
			suffix = ".pl";
			System.out.println(command);
			break;
		case "Haskell":
			command += "ghc " + CLASS_FILE_NAME + ".hs -v0 -fno-warn-tabs 2> " + compilerError;
			suffix = ".hs";
			break;
			
		default:
			LOGGER.log(Level.WARNING, "Compiler command not found!");
			break;
		}

		return new CompilationInfo(command, suffix);
	}

	public static String execution(Submissions submission, TestCases testCase) {

		long uniqueId = submission.getId();
		String dirName = submission.getId() + "_" + submission.getLanguage().getName();
		String command = "firejail --private=" + PATH_FIREJAIL + Path.separator + dirName + " --quiet --net=none cat "
				+ dirName + Path.separator + testCase.getId() + " | ";

		String runOutput = "output_" + submission.getId() + "_" + testCase.getId() + ".txt";

		switch (submission.getLanguage().getCompilerName()) {
		case "Java 8":
			command += "timeout 3s java " + CLASS_FILE_NAME + " 2> " + RUN_ERROR + " > " + runOutput;
			break;
		case "C++11 (gcc 5.4.0)":
			command += " timeout 2 ./" + CLASS_FILE_NAME + "_exec_" + uniqueId + " 2> " + RUN_ERROR + " > " + runOutput;
			break;
		case "Python 2.7":
			command += "timeout 10 python " + CLASS_FILE_NAME + ".py 2> " + RUN_ERROR + " > " + runOutput + "";
			break;
		case "C# (mono 4.2.1)":
			command += "timeout 3 ./" + CLASS_FILE_NAME + "_exec_" + uniqueId + " 2> " + RUN_ERROR + " > " + runOutput;
			break;
		case "Prolog":
			command += "timeout 3s ./" + CLASS_FILE_NAME + " 2> " + RUN_ERROR + " > " + runOutput;
			System.out.println(command);
			break;
		case "Haskell":
			command += "timeout 3s ./" + CLASS_FILE_NAME + " ./"+uniqueId+"_Haskell/"+testCase.getId()+ " 2> " + RUN_ERROR + " > " + runOutput;
			break;
		default:
			break;
		}

		return command;

	}

}

