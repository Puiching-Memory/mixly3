import sys
from ampy.cli import cli, _board


if __name__ == "__main__":
    error_exit = False
    try:
        cli()
    except BaseException as e:
        if getattr(e, 'code', True):
            print('Error: {}'.format(e))
            error_exit = True
    finally:
        # Try to ensure the board serial connection is always gracefully closed.
        if _board is not None:
            try:
                _board.close()
            except:
                # Swallow errors when attempting to close as it's just a best effort
                # and shouldn't cause a new error or problem if the connection can't
                # be closed.
                pass
        if error_exit:
            sys.exit(1)